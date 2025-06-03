declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_CHAT_ID: string;
    NEXT_PUBLIC_GA_ID?: string;
  }
}