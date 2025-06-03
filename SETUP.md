# Quick Setup Guide

## Step 1: Environment Variables

Copy the example file and add your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Telegram Bot Configuration (Optional for testing)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Cron Job Security (Optional for testing)
CRON_SECRET=any_random_string_here
```

## Step 2: Database Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-setup.sql`
4. Click **Run** to create the table and sample data

## Step 3: Test the Application

```bash
npm run dev
```

Visit http://localhost:3001 (or the port shown in terminal)

## Troubleshooting

### "column lotto_results.round does not exist"
- Run the SQL from `database-setup.sql` in your Supabase SQL editor

### "Missing required environment variables"
- Make sure `.env.local` exists with proper values
- Check that SUPABASE_URL and SUPABASE_ANON_KEY are set

### Telegram contact form not working
- This is optional for testing
- Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID when you're ready to deploy

## Need Help?

1. Check that Supabase project is active
2. Verify environment variables are correct
3. Ensure database table was created successfully
4. Check browser console for any additional errors