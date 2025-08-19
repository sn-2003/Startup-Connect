import { NextRequest, NextResponse } from 'next/server';
import { withAuth, handleApiError } from '@/lib/middleware';
import { supabaseAdmin } from '@/lib/supabase';
import { CoinSystem } from '@/lib/coin-system';

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;
    console.log('Upload request received for user:', user.id);
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'logo' or 'promo'
    const startupId = formData.get('startupId') as string;

    console.log('Upload parameters:', { type, startupId, fileSize: file?.size, fileType: file?.type });

    if (!file) {
      console.error('No file provided in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!type || !['logo', 'promo'].includes(type)) {
      console.error('Invalid upload type:', type);
      return NextResponse.json(
        { error: 'Invalid upload type. Must be "logo" or "promo"' },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
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

    console.log('Uploading to bucket:', bucketName, 'with filename:', fileName);

    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase environment variables not configured');
      return NextResponse.json(
        { error: 'Storage service not configured' },
        { status: 500 }
      );
    }

    // Upload to Supabase Storage using admin client
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: type === 'logo' // Allow overwrite for logos
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: `Failed to upload file: ${uploadError.message}` },
        { status: 500 }
      );
    }

    console.log('File uploaded successfully:', uploadData);

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log('Public URL generated:', publicUrl);

    // Award coins for uploading files
    if (type === 'logo') {
      await CoinSystem.awardCoins(user.id, 'STARTUP_LOGO_UPLOAD', { startupId, fileName });
    } else if (type === 'promo') {
      await CoinSystem.awardCoins(user.id, 'STARTUP_PROMO_UPLOAD', { startupId, fileName });
    }

    return NextResponse.json({ 
      data: {
        url: publicUrl,
        fileName: fileName
      },
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error('Unexpected error in upload route:', error);
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

    // Delete from Supabase Storage using admin client
    const { error: deleteError } = await supabaseAdmin.storage
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