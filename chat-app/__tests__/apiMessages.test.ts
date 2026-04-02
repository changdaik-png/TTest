import { GET, POST } from '@/app/api/messages/route';
import { kv } from '@vercel/kv';

jest.mock('@vercel/kv', () => ({
  kv: {
    lrange: jest.fn(),
    rpush: jest.fn()
  }
}));

jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: (body: any, init?: any) => new Response(JSON.stringify(body), { ...init, headers: { 'Content-Type': 'application/json'} })
    }
  }
});

describe('/api/messages API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET returns messages from Redis', async () => {
    (kv.lrange as jest.Mock).mockResolvedValueOnce([
      { id: 1, text: 'Test', user: 'User 1' }
    ]);

    const res = await GET();
    const data = await res.json();
    
    expect(kv.lrange).toHaveBeenCalledWith('chat_messages', 0, -1);
    expect(data).toEqual([{ id: 1, text: 'Test', user: 'User 1' }]);
  });

  it('POST saves a message to Redis', async () => {
    const req = new Request('http://localhost/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Hello World' })
    });

    const res = await POST(req);
    const data = await res.json();

    expect(kv.rpush).toHaveBeenCalledWith('chat_messages', expect.objectContaining({
      text: 'Hello World',
      user: 'Anonymous'
    }));
    expect(data).toEqual({ success: true });
  });
});
