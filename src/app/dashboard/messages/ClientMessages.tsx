"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { sendMessageAction, startConversationAction, markMessagesAsRead } from '@/app/actions/messages';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function ClientMessages({ user, initialConversation }: { user: any, initialConversation: any }) {
  const [conversation, setConversation] = useState(initialConversation);
  const [messages, setMessages] = useState<any[]>(initialConversation?.messages || []);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (conversation?.id) {
      markMessagesAsRead(conversation.id);
    }
  }, [messages, conversation?.id]);

  useEffect(() => {
    // If no conversation exists yet, start one automatically so they can text
    if (!conversation) {
      startConversationAction().then(res => {
        if (res.success) setConversation(res.conversation);
      });
    }
  }, [conversation]);

  useEffect(() => {
    if (!conversation?.id) return;

    // Fallback polling mechanism since Supabase Realtime might not be enabled on the table
    const fetchLatestMessages = async () => {
      const { getLatestMessages } = await import('@/app/actions/polling');
      const latest = await getLatestMessages(conversation.id);
      if (latest) {
        setMessages(prev => {
          const isDifferent = 
            latest.length !== prev.length || 
            (latest.length > 0 && prev.length > 0 && latest[latest.length - 1].id !== prev[prev.length - 1].id);
          
          if (isDifferent) return latest;
          return prev;
        });
      }
    };

    const intervalId = setInterval(fetchLatestMessages, 5000);
    return () => clearInterval(intervalId);
  }, [conversation?.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !conversation) return;

    const tempId = `temp-${Date.now()}`;
    const newMsg = {
      id: tempId,
      text: input,
      senderId: user.id,
      createdAt: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsSending(true);

    const res = await sendMessageAction(conversation.id, newMsg.text);
    if (res.success) {
      setMessages(prev => prev.map(m => m.id === tempId ? res.message : m));
    }
    setIsSending(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[24px] border border-black/5 overflow-hidden">
      {/* Header */}
      <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc] flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-manrope text-[18px] font-bold text-ink">Account Manager</h2>
          <p className="text-[12px] text-[#008b45] font-bold flex items-center gap-[4px]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#008b45]"></span> Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-[20px] space-y-[20px] bg-[#f7f9f7]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-60">
            <div className="w-[60px] h-[60px] bg-[#eef3ef] rounded-full flex items-center justify-center mb-4 text-[#008b45]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <p className="text-[14px] text-ink font-bold">Start the conversation</p>
            <p className="text-[13px] text-[#68736d]">Send a message to your dedicated account manager.</p>
          </div>
        ) : (
          messages.map((msg: any) => {
            const isMe = msg.senderId === user.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`p-[15px] rounded-[16px] text-[14px] leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-[#008b45] text-white rounded-tr-[4px]' 
                      : 'bg-white border border-black/5 text-ink rounded-tl-[4px]'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#7a847f] mt-[5px] mx-[5px]">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-[20px] bg-white border-t border-black/5 shrink-0">
        <form onSubmit={handleSend} className="relative flex gap-[10px]">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 h-[50px] bg-[#f7f9f7] rounded-full px-[20px] outline-none border border-black/5 focus:border-[#008b45] focus:bg-white transition-all text-[14px]"
          />
          <button type="submit" disabled={!input.trim()} className="w-[50px] h-[50px] rounded-full bg-[#008b45] flex items-center justify-center text-white hover:bg-[#007339] disabled:opacity-50 transition-colors shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
