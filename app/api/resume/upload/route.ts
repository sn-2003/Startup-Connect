import { NextRequest, NextResponse } from 'next/server';
import { withAuth, handleApiError } from '@/lib/middleware';
import { supabaseAdmin } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { CoinSystem } from '@/lib/coin-system';

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Check for existing resume and delete old file if present
    const existingResume = await prisma.resume.findUnique({
      where: { userId: user.id },
    });
    if (existingResume && existingResume.pdfUrl) {
      // Extract the old file path from the URL
      // The path is everything after the bucket name in the URL
      // e.g. https://.../object/public/resumes/userid/filename.pdf
      // We want userid/filename.pdf
      const url = new URL(existingResume.pdfUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(p => p === 'resumes');
      if (bucketIndex !== -1 && pathParts.length > bucketIndex + 1) {
        const filePath = pathParts.slice(bucketIndex + 1).join('/');
        if (filePath) {
          await supabaseAdmin.storage.from('resumes').remove([filePath]);
        }
      }
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExtension}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('resumes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('resumes')
      .getPublicUrl(fileName);

    // Update or create resume record
    const resumeData = {
      pdfUrl: publicUrl,
      pdfFileName: file.name,
    };

    let resume;
    if (existingResume) {
      // Update existing resume
      resume = await prisma.resume.update({
        where: { userId: user.id },
        data: resumeData,
      });
    } else {
      // Create new resume with basic info
      resume = await prisma.resume.create({
        data: {
          ...resumeData,
          userId: user.id,
          name: user.name || '',
          email: user.email || '',
          skills: [],
        },
      });
    }

    // Award coins for uploading resume
    await CoinSystem.awardCoins(user.id, 'RESUME_UPLOAD', { fileName: file.name });
    await CoinSystem.checkAndAwardMilestones(user.id);

    return NextResponse.json({ 
      data: resume,
      message: 'Resume uploaded successfully' 
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    return handleApiError(error);
  }
});

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;

    const resume = await prisma.resume.findUnique({
      where: { userId: user.id },
    });

    if (!resume || !resume.pdfUrl) {
      return NextResponse.json(
        { error: 'No resume found' },
        { status: 404 }
      );
    }

    // Extract filename from URL
    const urlParts = resume.pdfUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const fullPath = `${user.id}/${fileName}`;

    // Delete from Supabase Storage
    const { error: deleteError } = await supabaseAdmin.storage
      .from('resumes')
      .remove([fullPath]);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      // Continue with database update even if storage delete fails
    }

    // Update database record
    const updatedResume = await prisma.resume.update({
      where: { userId: user.id },
      data: {
        pdfUrl: null,
        pdfFileName: null,
      },
    });

    return NextResponse.json({ 
      data: updatedResume,
      message: 'Resume deleted successfully' 
    });
  } catch (error) {
    console.error('Resume delete error:', error);
    return handleApiError(error);
  }
}); 