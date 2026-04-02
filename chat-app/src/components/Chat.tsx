import React, { useState, useEffect } from 'react';

type Message = {
  id: number;
  text: string;
  user: string;
};

export default function Chat({ email }: { email?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const fetchMessages = async () => {
    const res = await fetch('/api/messages');
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText, user: email || 'Anonymous' }),
    });
    
    setInputText('');
    fetchMessages();
  };

  return (
    <div className="flex flex-col h-96 max-w-md mx-auto border rounded-xl overflow-hidden shadow-lg mt-10">
      <div className="bg-gray-800 text-white p-4 font-bold text-center">Chat App</div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white p-2 rounded-lg shadow-sm border max-w-[80%]">
            <span className="text-xs text-blue-500 font-bold block">{msg.user}</span>
            <span className="text-gray-800">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="p-3 bg-white border-t flex gap-2">
        <input 
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
