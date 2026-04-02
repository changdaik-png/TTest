import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from '@/components/Chat';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ id: 1, text: 'Hello', user: 'User 1' }]),
  })
) as jest.Mock;

describe('Chat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat input and send button', async () => {
    render(<Chat />);
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('fetches and displays messages on initial load', async () => {
    render(<Chat />);
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  it('posts a new message when send button is clicked', async () => {
    render(<Chat />);
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'New message' } });
    
    // override fetch for the post
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      // should have called POST to api/messages
      expect(global.fetch).toHaveBeenCalledWith('/api/messages', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'New message' })
      }));
    });
  });
});
