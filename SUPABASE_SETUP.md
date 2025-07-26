# Supabase Storage Setup for Resume PDF Upload

## Prerequisites
- Supabase project created
- Environment variables configured

## Storage Bucket Setup

1. **Create Storage Bucket**
   - Go to your Supabase dashboard
   - Navigate to Storage section
   - Click "Create a new bucket"
   - Name: `resumes`
   - Make it private (recommended for security)
   - Click "Create bucket"

2. **Configure Storage Policies**
   - Go to Storage > Policies
   - Select the `resumes` bucket
   - Add the following policies:

### Policy 1: Allow authenticated users to upload their own resumes
```sql
-- Policy name: "Users can upload their own resumes"
-- Operation: INSERT
-- Target roles: authenticated
-- Policy definition:
(auth.uid()::text = (storage.foldername(name))[1])
```

### Policy 2: Allow users to view their own resumes
```sql
-- Policy name: "Users can view their own resumes"
-- Operation: SELECT
-- Target roles: authenticated
-- Policy definition:
(auth.uid()::text = (storage.foldername(name))[1])
```

### Policy 3: Allow users to update their own resumes
```sql
-- Policy name: "Users can update their own resumes"
-- Operation: UPDATE
-- Target roles: authenticated
-- Policy definition:
(auth.uid()::text = (storage.foldername(name))[1])
```

### Policy 4: Allow users to delete their own resumes
```sql
-- Policy name: "Users can delete their own resumes"
-- Operation: DELETE
-- Target roles: authenticated
-- Policy definition:
(auth.uid()::text = (storage.foldername(name))[1])
```

## Environment Variables

Make sure your `.env.local` file includes:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

1. Start your development server: `npm run dev`
2. Navigate to the dashboard
3. Go to the "My Resume" section
4. Try uploading a PDF file
5. Verify the file appears in your Supabase storage bucket

## Security Notes

- Files are stored in user-specific folders: `{user_id}/{timestamp}.pdf`
- Only authenticated users can access their own files
- File size is limited to 10MB
- Only PDF files are accepted
- Files are automatically cleaned up when users delete their resumes

## Troubleshooting

If you encounter issues:

1. **Upload fails**: Check storage policies and bucket permissions
2. **File not found**: Verify the file path and user authentication
3. **Permission denied**: Ensure the user is authenticated and policies are correct
4. **Storage quota exceeded**: Check your Supabase plan limits 