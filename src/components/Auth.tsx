import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    await supabase.auth.signUp({ email, password });
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithPassword({ email, password });
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-sm mx-auto shadow rounded-lg mt-10">
      <h2 className="text-xl font-bold">Authentication</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded"
      />
      <div className="flex justify-between gap-2">
        <button 
          onClick={handleLogin}
          className="bg-blue-500 text-white p-2 rounded flex-1 hover:bg-blue-600"
        >
          Login
        </button>
        <button 
          onClick={handleRegister}
          className="bg-green-500 text-white p-2 rounded flex-1 hover:bg-green-600"
        >
          Register
        </button>
      </div>
    </div>
  );
}
