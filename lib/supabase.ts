import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client with realtime configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  // Disable realtime for server-side rendering
  realtime: typeof window === 'undefined' ? undefined : {
    // @ts-ignore - The type definition is outdated
    eventsPerSecond: 10,
  },
  global: {
    // Use the correct fetch implementation based on environment
    fetch: (...args) => {
      if (typeof window === 'undefined') {
        return fetch(...args as [RequestInfo | URL, RequestInit?]);
      }
      return window.fetch(...args as [RequestInfo, RequestInit?]);
    },
  },
});

// Server-side Supabase client with service role key for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: undefined, // Disable realtime for admin client
  }
);

// Workaround for WebSocket bufferutil issue in Next.js
if (typeof window === 'undefined') {
  try {
    // Only set WebSocket if it's not already set
    if (!globalThis.WebSocket) {
      const ws = require('ws');
      globalThis.WebSocket = ws;
      globalThis.Buffer = require('buffer').Buffer;
    }
  } catch (error) {
    console.warn('Failed to initialize WebSocket polyfill:', error);
  }
}