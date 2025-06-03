export class EnvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvError';
  }
}

export function validateEnv() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ] as const;

  const missingVars: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(', ')}`;
    
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Environment Error:', message);
      console.log('💡 Please copy .env.local.example to .env.local and fill in the values');
    }
    
    throw new EnvError(message);
  }

  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.TELEGRAM_CHAT_ID,
    gaId: process.env.NEXT_PUBLIC_GA_ID
  };
}

export function checkTelegramConfig() {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Telegram bot configuration missing. Contact form will not work.');
    }
    return false;
  }
  return true;
}