import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth-options';
import { CoinSystem } from '@/lib/coin-system';

export async function POST(req: NextRequest) {
  try {
    // Check if Gemini API key is configured
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable not configured');
      return NextResponse.json({ 
        success: false, 
        error: 'AI service not configured' 
      }, { status: 500 });
    }

    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: 'Question is required' 
      }, { status: 400 });
    }

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // For now, fetch all user data. In the future, analyze the question to fetch only relevant data.
    const [resume, startups, applications] = await Promise.all([
      prisma.resume.findUnique({
        where: { userId: user.id },
        include: {
          experience: { orderBy: { order: 'asc' } },
          education: { orderBy: { order: 'asc' } },
          customSections: { orderBy: { order: 'asc' } },
        },
      }),
      prisma.startup.findMany({
        where: { userId: user.id },
        include: {
          jobs: true,
          votes: true,
          feedback: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.application.findMany({
        where: { userId: user.id },
        include: {
          job: {
            include: {
              startup: { select: { name: true, logo: true } },
              customQuestions: { orderBy: { order: 'asc' } },
            },
          },
          customAnswers: {
            include: { question: true },
            orderBy: { question: { order: 'asc' } },
          },
        },
        orderBy: { appliedAt: 'desc' },
      }),
    ]);

    // Fetch last 10 chat messages for context
    const chatHistory = await prisma.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    // Add the new user message to the history
    const newUserMessage = { sender: 'user', text: question };
    const historyWithNew = [...chatHistory, newUserMessage];

    // Platform context for the AI
    const platformContext = `
Platform: StartupGram
Description: StartupGram is a modern platform for startups, founders, and job seekers. Users can:
- Register and manage their own startups (add details, jobs, funding info, etc.)
- Apply for jobs at startups, save jobs, and track applications
- Build and update a professional resume
- Discover resources, guides, and templates for founders and job seekers
- Connect with investors and incubators
- Give and receive feedback on startups
- Use a dashboard to manage all activities

To register a startup: Go to the dashboard, click 'My Startups', and use the 'Add Startup' button.
To add a job: In 'My Startups', select your startup and use the 'Add Job' button.
To apply for jobs: Browse the job board, select a job, and click 'Apply'.
To update your resume: Go to the 'My Resume' section in the dashboard.
To connect with investors: Use the 'Investors' tab in the dashboard.
Always provide friendly, step-by-step help for platform features.

System instructions:
- If the user is already in an ongoing conversation, do not repeat greetings or introductions (do not start with 'Hi', 'Hello', 'Hey', etc.).
- Focus on the user's latest question or intent.
- If the user asks for a reminder or goal, acknowledge and remember it for future reference.
- Be concise and avoid unnecessary repetition. Only provide long, step-by-step answers if the user specifically asks for a detailed guide.
- Otherwise, keep answers short and to the point.`;

    // Build chat history as a conversation
    const chatContext = historyWithNew.map(m => `${m.sender === 'user' ? 'User' : 'Nova'}: ${m.text}`).join('\n');

    // Compose the prompt for the AI
    const prompt = `${platformContext}\n\nHere is the recent conversation:\n${chatContext}\n\nHere is their profile:\n${JSON.stringify(user, null, 2)}\n\nHere are their startups:\n${JSON.stringify(startups, null, 2)}\n\nHere is their resume:\n${JSON.stringify(resume, null, 2)}\n\nHere are jobs they have applied to:\n${JSON.stringify(applications, null, 2)}\n\nContinue the conversation as Nova, the friendly mentor.`;

    // Use Gemini to get a response
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const aiMessage = result.response.text();
    
    // Remove 'Nova:' prefix if present
    const cleanAiMessage = aiMessage.replace(/^Nova:\s*/i, '');

    // Save both user and AI messages to the database
    await prisma.chatMessage.createMany({
      data: [
        { userId: user.id, sender: 'user', text: question },
        { userId: user.id, sender: 'ai', text: cleanAiMessage },
      ],
    });

    // Award coins for using AI mentor
    await CoinSystem.awardCoins(user.id, 'AI_CHAT', { messageLength: question.length });

    return NextResponse.json({ 
      success: true, 
      data: { message: cleanAiMessage } 
    });
  } catch (error) {
    console.error('AI Mentor API Error:', error);
    const err = error as Error;
    
    // Handle specific Gemini API errors
    if (err.message.includes('API_KEY')) {
      return NextResponse.json({ 
        success: false, 
        error: 'AI service configuration error' 
      }, { status: 500 });
    }
    
    if (err.message.includes('quota') || err.message.includes('rate limit')) {
      return NextResponse.json({ 
        success: false, 
        error: 'AI service temporarily unavailable' 
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'An error occurred while processing your request' 
    }, { status: 500 });
  }
} 