# Supabase Authentication Setup

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Keep existing KV/Redis for non-auth data if needed
KV_REST_API_URL=your_vercel_kv_url
KV_REST_API_TOKEN=your_vercel_kv_token
REDIS_URL=your_redis_url

# JWT Secret (no longer needed for auth, but keep for other uses)
JWT_SECRET=your_jwt_secret_for_other_purposes
```

## How to Get Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > API
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Project Setup

1. **Enable Email Authentication:**
   - Go to Authentication > Settings
   - Enable "Enable email confirmations" if you want email verification
   - Configure your site URL (e.g., `http://localhost:3000` for development)

2. **Configure RLS (Row Level Security):**
   - The auth system will work out of the box
   - You can add custom tables later with RLS policies

3. **Email Templates (Optional):**
   - Customize email templates in Authentication > Email Templates
   - Configure SMTP settings if you want custom email sending

## Migration Notes

- **User data** is now stored in Supabase Auth (users table)
- **KV storage** is still available for non-auth data (bookings, timetable, etc.)
- **Sessions** are automatically managed by Supabase
- **Password hashing** is handled by Supabase
- **Email verification** is built-in (configurable)

## Testing the Migration

1. Start your development server: `npm run dev`
2. Try registering a new user
3. Check your email for verification (if enabled)
4. Try logging in with the new credentials
5. Verify that sessions persist across page refreshes
