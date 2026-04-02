import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const messages = await kv.lrange('chat_messages', 0, -1);
    return NextResponse.json(messages || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { text, user } = await req.json();
    
    const newMessage = {
      id: Date.now(),
      text,
      user: user || 'Anonymous'
    };

    await kv.rpush('chat_messages', newMessage);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post message' }, { status: 500 });
  }
}
