import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './button';
import { Textarea } from './textarea';
import { MessageCircle, X, Sparkles, Square, Move } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface Position {
  x: number;
  y: number;
}

export default function FloatableAiNova() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [aiTypingText, setAiTypingText] = useState('');
  const [aiTypingFullText, setAiTypingFullText] = useState('');
  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const abortControllerRef = useRef<AbortController | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const aiTypingAnswerRef = useRef('');
  const aiTypingRef = useRef(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Load chat history on chat open
  useEffect(() => {
    if (open && messages.length === 0 && user) {
      setSuggestionLoading(true);
      // Fetch chat history
      fetch('/api/ai-mentor/history', { method: 'GET' })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
            setMessages(data.messages.map((m: any) => ({ sender: m.sender, text: m.text })));
            setSuggestions([]);
          } else {
            // If no history, fetch suggestions
            fetch('/api/ai-mentor/suggestions', { method: 'GET' })
              .then(res => res.json())
              .then(data => {
                if (data.success && Array.isArray(data.suggestions)) {
                  setSuggestions(data.suggestions);
                }
              })
              .finally(() => setSuggestionLoading(false));
          }
          if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
            setSuggestionLoading(false);
          }
        })
        .catch(() => setSuggestionLoading(false));
    }
  }, [open, messages.length, user]);

  // Fetch proactive suggestions when chat opens
  useEffect(() => {
    if (open && messages.length === 0 && user) {
      setSuggestionLoading(true);
      fetch('/api/ai-mentor/suggestions', { method: 'GET' })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.suggestions)) {
            setSuggestions(data.suggestions);
          }
        })
        .finally(() => setSuggestionLoading(false));
    }
  }, [open, messages.length, user]);

  // Improved scroll-to-bottom logic
  const scrollToBottom = () => {
    if (!chatRef.current) return;
    // Only scroll if user is near the bottom (within 100px)
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    if (scrollHeight - (scrollTop + clientHeight) < 100) {
      requestAnimationFrame(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, aiTypingText]);

  const sendMessage = async (questionOverride?: string) => {
    const text = questionOverride ?? input;
    if (!text.trim()) return;
    const userMsg = { sender: 'user' as const, text };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    setSuggestions([]);
    setAiTyping(false);
    setAiTypingText('');
    setAiTypingFullText('');

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/ai-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      const aiMessage = data?.data?.message || "Sorry, I didn't get a response.";

      setAiTyping(true);
      aiTypingRef.current = true;
      aiTypingAnswerRef.current = '';
      // Typing animation (word by word)
      const words = aiMessage.split(' ');
      let currentText = '';
      for (let i = 0; i < words.length; i++) {
        if (!aiTypingRef.current) break;
        currentText += (i > 0 ? ' ' : '') + words[i];
        setAiTypingText(currentText);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      setAiTypingFullText(currentText);

      if (aiTypingRef.current) {
        setMessages((msgs) => [...msgs, { sender: 'ai', text: currentText }]);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error:', error);
        setMessages((msgs) => [...msgs, { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } finally {
      setLoading(false);
      setAiTyping(false);
      setAiTypingText('');
      setAiTypingFullText('');
      aiTypingRef.current = false;
      abortControllerRef.current = null;
    }
  };

  const stopAi = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    aiTypingRef.current = false;
    setLoading(false);
    setAiTyping(false);
    setAiTypingText('');
    setAiTypingFullText('');
  };

  // Remove all drag/floating logic
  // Remove position, isDragging, dragOffset, handleMouseDown, handleMouseMove, handleMouseUp, and related refs
  // Remove style and event handlers related to dragging from the button

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center space-x-2"
          onClick={() => setOpen(true)}
          aria-label="Open AI Mentor Chat"
        >
          <span className="mr-2 text-xl animate-waving-hand">👋</span>
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      
      {/* Chat Window */}
      {open && (
        <div
          className="fixed z-50 w-96 max-w-full max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden animate-fade-in"
          style={{ right: '1.5rem', bottom: '1.5rem' }}
        >
          <div
            className="flex items-center justify-between bg-blue-600 text-white px-6 py-4"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🤖</span>
              <div>
                <span className="font-extrabold text-lg">Nova</span>
                <span className="block text-xs font-medium opacity-80">your AI Mentor</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setOpen(false)} aria-label="Close chat">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="px-6 pt-3 pb-2 bg-blue-50 text-blue-900 text-sm font-medium">
            Hi! I'm Nova. Ask me anything about startups, jobs, or your profile. 🚀
          </div>
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-6 space-y-3 bg-blue-50"
            style={{ maxHeight: 'calc(60vh - 120px)', minHeight: 0, overscrollBehavior: 'contain', scrollBehavior: 'smooth' }}
          >
            {messages.length === 0 && (
              <>
                <div className="text-blue-700 text-sm text-center py-4">I'm here to help you on your journey. What would you like to know?</div>
                {suggestionLoading && (
                  <div className="flex items-center justify-center text-blue-500 py-4"><Sparkles className="mr-2 animate-spin" />Finding suggestions...</div>
                )}
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-blue-700 font-semibold mb-1 flex items-center"><Sparkles className="w-4 h-4 mr-1" />Suggestions for you:</div>
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        className="w-full text-left bg-white border border-blue-200 rounded-lg px-4 py-2 text-blue-900 hover:bg-blue-100 transition-colors text-sm mb-1"
                        onClick={() => sendMessage(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-xl max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-blue-100 text-blue-900'}`}>
                  {msg.sender === 'ai' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {aiTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-xl bg-white border border-blue-100 text-blue-900 text-sm whitespace-pre-line">
                  <ReactMarkdown>{aiTypingText}</ReactMarkdown>
                </div>
              </div>
            )}
            {loading && !aiTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-xl bg-white border border-blue-100 text-blue-900 text-sm animate-pulse">Thinking...</div>
              </div>
            )}
          </div>
          <div className="p-4 bg-white border-t border-blue-100 flex items-center space-x-2">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type your question..."
              className="flex-1 resize-none min-h-[36px] max-h-24"
              disabled={loading || aiTyping}
            />
            {aiTyping || loading ? (
              <Button onClick={stopAi} size="sm" className="bg-red-600 hover:bg-red-700 text-white" title="Stop generating">
                <Square className="w-4 h-4" /> Stop
              </Button>
            ) : (
              <Button onClick={() => sendMessage()} disabled={!input.trim()} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Send
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
} 