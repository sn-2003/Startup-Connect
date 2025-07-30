import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { comment } = await request.json();

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      );
    }

    // Check if the feedback exists and belongs to the user
    const existingFeedback = await prisma.startupFeedback.findUnique({
      where: { id: params.id },
      include: { user: true }
    });

    if (!existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    if (existingFeedback.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own feedback' },
        { status: 403 }
      );
    }

    // Update the feedback
    const updatedFeedback = await prisma.startupFeedback.update({
      where: { id: params.id },
      data: { comment: comment.trim() },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedFeedback
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the feedback exists and belongs to the user
    const existingFeedback = await prisma.startupFeedback.findUnique({
      where: { id: params.id },
      include: { user: true }
    });

    if (!existingFeedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    if (existingFeedback.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own feedback' },
        { status: 403 }
      );
    }

    // Delete the feedback
    await prisma.startupFeedback.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      data: { success: true }
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 