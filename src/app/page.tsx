"use client";

import React, { useEffect, useState } from 'react';
import Chat from '@/components/Chat';
import Auth from '@/components/Auth';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-8 drop-shadow-sm">Real-time Vercel Chat</h1>
      
      {!session ? (
        <div className="w-full w-max-md">
          <p className="text-center text-gray-500 mb-4">Please log in to participate in the chat.</p>
          <Auth />
        </div>
      ) : (
        <div className="w-full w-max-md flex flex-col items-center">
           <div className="mb-4">
               <span className="text-sm font-semibold">Logged in as {session.user.email}</span>
               <button 
                 onClick={() => supabase.auth.signOut()}
                 className="ml-4 text-xs bg-red-500 text-white p-1 rounded"
               >
                 Sign Out
               </button>
           </div>
           <Chat email={session.user.email} />
        </div>
      )}
    </main>
  );
}
