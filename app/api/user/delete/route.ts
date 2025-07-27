import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, handleApiError } from '@/lib/middleware';
import { supabase } from '@/lib/supabase';

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;

    // First, get the user's resume to delete PDF file from Supabase
    const userResume = await prisma.resume.findUnique({
      where: { userId: user.id },
    });

    // Delete PDF file from Supabase storage if it exists
    if (userResume?.pdfUrl) {
      try {
        const url = new URL(userResume.pdfUrl);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.findIndex(p => p === 'resumes');
        if (bucketIndex !== -1 && pathParts.length > bucketIndex + 1) {
          const filePath = pathParts.slice(bucketIndex + 1).join('/');
          if (filePath) {
            await supabase.storage.from('resumes').remove([filePath]);
          }
        }
      } catch (storageError) {
        console.error('Error deleting resume file from storage:', storageError);
        // Continue with account deletion even if file deletion fails
      }
    }

    // Delete user and all related data using Prisma's cascade delete
    // This will automatically delete:
    // - startups (and their jobs, applications, etc.)
    // - resume (and experience, education, custom sections)
    // - applications
    // - saved jobs
    // - startup votes
    // - startup feedback
    // - chat messages
    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return handleApiError(error);
  }
}); 