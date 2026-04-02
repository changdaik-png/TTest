import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
    } else {
      alert('Registration successful! Please check your email for confirmation if required.');
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-sm mx-auto bg-white shadow-xl rounded-2xl mt-10 border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800">Authentication</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        disabled={loading}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        disabled={loading}
      />
      <div className="flex justify-between gap-3 mt-2">
        <button 
          onClick={handleLogin}
          className="bg-blue-600 text-white p-3 rounded-xl flex-1 font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Login'}
        </button>
        <button 
          onClick={handleRegister}
          className="bg-emerald-500 text-white p-3 rounded-xl flex-1 font-semibold hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Register'}
        </button>
      </div>
      <p className="text-xs text-center text-gray-400 mt-2">
        Note: Check your email inbox after registration!
      </p>
    </div>
  );
}
