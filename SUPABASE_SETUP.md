# Supabase Storage Setup for Venture-Link

## Prerequisites
- Supabase project created
- Environment variables configured

## Environment Variables Setup

### Local Development (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

### Production Deployment (Vercel)
You need to add these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:

#### Required Variables:
- `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key (for server-side operations)
- `GEMINI_API_KEY` = Your Google Gemini API key (for AI mentor feature)

#### How to get the Service Role Key:
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the "service_role" key (NOT the anon key)
4. This key has admin privileges and should only be used server-side

#### How to get the Gemini API Key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

**Important:** 
- The `SUPABASE_SERVICE_ROLE_KEY` is required for file uploads in production
- The `GEMINI_API_KEY` is required for the AI mentor feature
- Without these keys, you'll get 500 errors when trying to use these features

## Storage Bucket Setup

### 1. Resume Storage Bucket
1. **Create Storage Bucket**
   - Go to your Supabase dashboard
   - Navigate to Storage section
   - Click "Create a new bucket"
   - Name: `resumes`
   - Make it private (recommended for security)
   - Click "Create bucket"

2. **Configure Storage Policies for Resumes**
   - Go to Storage > Policies
   - Select the `resumes` bucket
   - Add the following policies:

#### Policy 1: Allow authenticated users to upload their own resumes
```sql
-- Policy name: "Users can upload their own resumes"
-- Operation: INSERT
-- Target roles: authenticated
-- Policy definition:
(auth.uid()::text = (storage.foldername(name))[1])
```

#### Policy 2: Allow users to view their own resumes
```sql
-- Policy name: "Users can view their own resumes"
-- Operation: SELECT
-- Target roles: authenticated
-- Policy definition:
(auth.uid()::text = (storage.foldername(name))[1])
```

#### Policy 3: Allow users to update their own resumes
```sql
-- Policy name: "Users can update their own resumes"
-- Operation: UPDATE
-- Target roles: authenticated
-- Policy definition:
(auth.uid()::text = (storage.foldername(name))[1])
```

#### Policy 4: Allow users to delete their own resumes
```sql
-- Policy name: "Users can delete their own resumes"
-- Operation: DELETE
-- Target roles: authenticated
-- Policy definition:
(auth.uid()::text = (storage.foldername(name))[1])
```

### 2. Startup Logo Storage Bucket
1. **Create Storage Bucket**
   - Go to your Supabase dashboard
   - Navigate to Storage section
   - Click "Create a new bucket"
   - Name: `logos`
   - Make it public (logos need to be publicly accessible)
   - Click "Create bucket"

2. **Configure Storage Policies for Logos**
   - Go to Storage > Policies
   - Select the `logos` bucket
   - Add the following policies:

#### Policy 1: Allow authenticated users to upload logos
```sql
-- Policy name: "Authenticated users can upload logos"
-- Operation: INSERT
-- Target roles: authenticated
-- Policy definition:
(auth.role() = 'authenticated')
```

#### Policy 2: Allow public access to view logos
```sql
-- Policy name: "Public can view logos"
-- Operation: SELECT
-- Target roles: public
-- Policy definition:
(true)
```

#### Policy 3: Allow authenticated users to update logos
```sql
-- Policy name: "Authenticated users can update logos"
-- Operation: UPDATE
-- Target roles: authenticated
-- Policy definition:
(auth.role() = 'authenticated')
```

#### Policy 4: Allow authenticated users to delete logos
```sql
-- Policy name: "Authenticated users can delete logos"
-- Operation: DELETE
-- Target roles: authenticated
-- Policy definition:
(auth.role() = 'authenticated')
```

### 3. Promotional Images Storage Bucket
1. **Create Storage Bucket**
   - Go to your Supabase dashboard
   - Navigate to Storage section
   - Click "Create a new bucket"
   - Name: `promos`
   - Make it public (promotional images need to be publicly accessible)
   - Click "Create bucket"

2. **Configure Storage Policies for Promos**
   - Go to Storage > Policies
   - Select the `promos` bucket
   - Add the following policies:

#### Policy 1: Allow authenticated users to upload promotional images
```sql
-- Policy name: "Authenticated users can upload promos"
-- Operation: INSERT
-- Target roles: authenticated
-- Policy definition:
(auth.role() = 'authenticated')
```

#### Policy 2: Allow public access to view promotional images
```sql
-- Policy name: "Public can view promos"
-- Operation: SELECT
-- Target roles: public
-- Policy definition:
(true)
```

#### Policy 3: Allow authenticated users to update promotional images
```sql
-- Policy name: "Authenticated users can update promos"
-- Operation: UPDATE
-- Target roles: authenticated
-- Policy definition:
(auth.role() = 'authenticated')
```

#### Policy 4: Allow authenticated users to delete promotional images
```sql
-- Policy name: "Authenticated users can delete promos"
-- Operation: DELETE
-- Target roles: authenticated
-- Policy definition:
(auth.role() = 'authenticated')
```

## Testing

1. Start your development server: `npm run dev`
2. Navigate to the dashboard
3. Go to the "My Resume" section and try uploading a PDF file
4. Go to the "Startups" section and try creating a startup with a logo
5. Verify the files appear in your Supabase storage buckets

## Security Notes

- Resume files are stored in user-specific folders: `{user_id}/{timestamp}.pdf`
- Logo files are stored as: `startup-{startup_id}.{extension}`
- Promotional images are stored as: `promo-{startup_id}-{timestamp}-{random}.{extension}`
- Only authenticated users can upload files
- Resume files are private and only accessible to the owner
- Logo and promotional images are public for display purposes
- File size is limited to 10MB for resumes and 5MB for images
- Only PDF files are accepted for resumes, only images for logos/promos
- Files are automatically cleaned up when users delete their content

## Troubleshooting

If you encounter issues:

1. **Upload fails**: Check storage policies and bucket permissions
2. **File not found**: Verify the file path and user authentication
3. **Permission denied**: Ensure the user is authenticated and policies are correct
4. **Storage quota exceeded**: Check your Supabase plan limits
5. **JWS Protected Header is invalid**: This usually means the Supabase client isn't properly authenticated - use the API routes instead of direct client-side uploads
6. **500 Internal Server Error in production**: 
   - Check that `SUPABASE_SERVICE_ROLE_KEY` is set in your Vercel environment variables
   - Verify the service role key is correct (not the anon key)
   - Check Vercel function logs for detailed error messages
   - Ensure storage buckets exist and have proper policies
7. **AI Mentor 500 Error**:
   - Check that `GEMINI_API_KEY` is set in your Vercel environment variables
   - Verify the Gemini API key is valid and has quota remaining
   - Check Vercel function logs for specific error messages
   - Ensure the Google AI Studio API key has proper permissions 