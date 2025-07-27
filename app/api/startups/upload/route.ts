import { NextRequest, NextResponse } from 'next/server';
import { withAuth, handleApiError } from '@/lib/middleware';
import { supabase } from '@/lib/supabase';

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'logo' or 'promo'
    const startupId = formData.get('startupId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!type || !['logo', 'promo'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid upload type. Must be "logo" or "promo"' },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    let fileName: string;
    let bucketName: string;

    if (type === 'logo') {
      // For logos, use a consistent filename per startup
      const fileExt = file.name.split('.').pop();
      fileName = `startup-${startupId}.${fileExt}`;
      bucketName = 'logos';
    } else {
      // For promotional images, use unique filenames
      const fileExt = file.name.split('.').pop();
      fileName = `promo-${startupId}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      bucketName = 'promos';
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: type === 'logo' // Allow overwrite for logos
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return NextResponse.json({ 
      data: {
        url: publicUrl,
        fileName: fileName
      },
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error('File upload error:', error);
    return handleApiError(error);
  }
});

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');
    const type = searchParams.get('type'); // 'logo' or 'promo'

    if (!fileName || !type || !['logo', 'promo'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const bucketName = type === 'logo' ? 'logos' : 'promos';

    // Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (deleteError) {
      console.error('Supabase delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('File delete error:', error);
    return handleApiError(error);
  }
}); 