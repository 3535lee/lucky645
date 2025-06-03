import { NextRequest, NextResponse } from 'next/server';
import { checkTelegramConfig } from '@/lib/env-check';

export async function POST(request: NextRequest) {
  if (!checkTelegramConfig()) {
    return NextResponse.json(
      { error: 'Telegram configuration is missing' },
      { status: 500 }
    );
  }

  try {
    const { name, platform, account, message } = await request.json();

    if (!name || !platform || !account || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const telegramMessage = `
새로운 문의사항
이름: ${name}
플랫폼: ${platform}
${platform} 계정: ${account}
문의내용: ${message}

---
발송시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
      throw new Error('Failed to send telegram message');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending telegram message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}