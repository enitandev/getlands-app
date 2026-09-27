"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { sendMessageAction, assignAgentAction } from '@/app/actions/messages';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function ClientAdminMessages({ admin, conversations, agents }: { admin: any, conversations: any[], agents: any[] }) {
  const [activeChatId, setActiveChatId] = useState(conversations[0]?.id || null);
  const [localConversations, setLocalConversations] = useState(conversations);
  const [input, setInput] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = localConversations.find(c => c.id === activeChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  useEffect(() => {
    if (!supabaseUrl || !supabaseKey) return;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const channel = supabase
      .channel('admin-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Message' },
        (payload) => {
          setLocalConversations(prev => prev.map(conv => {
            if (conv.id === payload.new.conversationId) {
              if (conv.messages.find((m: any) => m.id === payload.new.id)) return conv;
              return { ...conv, messages: [...conv.messages, payload.new] };
            }
            return conv;
          }));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConv) return;

    const tempId = `temp-${Date.now()}`;
    const newMsg = {
      id: tempId,
      text: input,
      senderId: admin.id,
      conversationId: activeConv.id,
      createdAt: new Date().toISOString(),
      read: false
    };

    setLocalConversations(prev => prev.map(conv => {
      if (conv.id === activeConv.id) {
        return { ...conv, messages: [...conv.messages, newMsg] };
      }
      return conv;
    }));
    setInput('');

    const res = await sendMessageAction(activeConv.id, newMsg.text);
    if (res.success) {
      setLocalConversations(prev => prev.map(conv => {
        if (conv.id === activeConv.id) {
          return { ...conv, messages: conv.messages.map((m:any) => m.id === tempId ? res.message : m) };
        }
        return conv;
      }));
    }
  };

  const handleAssign = async (agentId: string) => {
    if (!activeConv) return;
    const res = await assignAgentAction(activeConv.id, agentId);
    if (res.success) {
      setLocalConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, agentId } : c));
    }
    setIsAssignModalOpen(false);
  };

  return (
    <div className="flex h-full bg-white">
      {/* Left Pane: Inbox List */}
      <div className="w-full lg:w-[350px] border-r border-black/5 flex flex-col shrink-0">
        <div className="p-[20px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
          <h2 className="font-manrope text-[18px] font-bold text-ink tracking-[-0.03em]">Support Inbox</h2>
        </div>
        
        <div className="p-[15px] border-b border-black/5 bg-[#fcfdfc]">
          <div className="relative">
            <svg className="absolute left-[12px] top-[10px] text-[#a1aba6]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Search customers..." className="w-full h-[36px] bg-[#eef3ef] rounded-full pl-[36px] pr-[15px] outline-none text-[13px] border border-transparent focus:border-[#008b45]" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {localConversations.length === 0 ? (
            <div className="p-8 text-center text-[#68736d] text-[13px]">No conversations yet.</div>
          ) : (
            localConversations.map(chat => {
              const lastMsg = chat.messages[chat.messages.length - 1];
              const unread = chat.messages.filter((m:any) => !m.read && m.senderId !== admin.id).length;
              
              return (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-[15px_20px] cursor-pointer flex items-center gap-[15px] border-b border-black/5 transition-colors ${activeChatId === chat.id ? 'bg-[#eef3ef]/50' : 'hover:bg-[#fcfdfc]'}`}
                >
                  <div className="relative">
                    <div className="w-[44px] h-[44px] rounded-full bg-[#f7f9f7] flex items-center justify-center text-[#008b45] font-bold text-[16px] shrink-0 border border-black/5">
                      {chat.customer.firstName.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-[4px]">
                      <strong className={`block text-[14px] truncate ${unread > 0 ? 'text-ink font-extrabold' : 'text-[#4a554f]'}`}>
                        {chat.customer.firstName} {chat.customer.lastName}
                      </strong>
                      <span className={`text-[11px] whitespace-nowrap ${unread > 0 ? 'text-[#008b45] font-bold' : 'text-[#a1aba6]'}`}>
                        {lastMsg ? new Date(lastMsg.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-[10px]">
                      <span className={`text-[12px] truncate ${unread > 0 ? 'text-ink font-bold' : 'text-[#68736d]'}`}>
                        {lastMsg ? lastMsg.text : 'New conversation'}
                      </span>
                      {unread > 0 && (
                        <span className="w-[18px] h-[18px] rounded-full bg-[#f5a623] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Chat */}
      {activeConv ? (
        <div className="hidden lg:flex flex-col flex-1 bg-[#fcfdfc]">
          {/* Chat Header */}
          <div className="h-[70px] border-b border-black/5 flex items-center justify-between px-[30px] shrink-0 bg-white">
            <div className="flex items-center gap-[15px]">
              <div className="w-[36px] h-[36px] rounded-full bg-[#f7f9f7] flex items-center justify-center text-[#008b45] font-bold text-[14px]">
                {activeConv.customer.firstName.charAt(0)}
              </div>
              <div>
                <strong className="block text-[15px] text-ink font-manrope">
                  {activeConv.customer.firstName} {activeConv.customer.lastName}
                </strong>
                {activeConv.agentId && (
                  <span className="text-[11px] text-[#008b45] font-bold">Assigned to: {agents.find(a => a.id === activeConv.agentId)?.firstName || 'Unknown'}</span>
                )}
              </div>
            </div>
            <div className="flex gap-[10px]">
              <button onClick={() => setIsAssignModalOpen(true)} className="px-[16px] py-[8px] bg-white border border-black/10 text-[#008b45] text-[12px] font-bold rounded-full hover:bg-[#eef3ef] transition-colors">
                Assign Agent
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-[30px] space-y-[20px]">
            {activeConv.messages.map((msg: any) => {
              const isMe = msg.senderId === admin.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`p-[15px] rounded-[16px] text-[14px] leading-[1.5] shadow-sm ${
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
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="p-[20px] bg-white border-t border-black/5 shrink-0">
            <form className="relative flex gap-[10px]" onSubmit={handleSend}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Type your reply to ${activeConv.customer.firstName}...`}
                className="flex-1 h-[50px] bg-[#f7f9f7] rounded-full px-[20px] outline-none border border-black/5 focus:border-[#008b45] focus:bg-white transition-all text-[14px]"
              />
              <button type="submit" disabled={!input.trim()} className="w-[50px] h-[50px] rounded-full bg-[#008b45] flex items-center justify-center text-white hover:bg-[#007339] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-col flex-1 bg-[#fcfdfc] items-center justify-center">
          <p className="text-[14px] text-[#68736d]">Select a conversation to start messaging</p>
        </div>
      )}

      {/* Assign Agent Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-[20px] animate-fade-in">
          <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl overflow-hidden">
            <div className="p-[20px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
              <h2 className="font-manrope text-[18px] font-bold text-ink">Assign Chat to Agent</h2>
              <button onClick={() => setIsAssignModalOpen(false)} className="w-[32px] h-[32px] bg-[#f7f9f7] rounded-full flex items-center justify-center hover:bg-[#eef3ef] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-[20px] space-y-[15px]">
              <p className="text-[13px] text-[#68736d] mb-[10px]">Select a sales agent to handle this inquiry.</p>
              
              <div className="space-y-[10px]">
                {agents.map(agent => (
                  <button key={agent.id} onClick={() => handleAssign(agent.id)} className="w-full p-[15px] border border-black/10 rounded-[12px] flex items-center gap-[15px] hover:border-[#008b45] hover:bg-[#eef3ef]/30 transition-all text-left">
                    <div className="w-[36px] h-[36px] rounded-full bg-[#008b45] text-white flex items-center justify-center font-bold text-[14px]">{agent.firstName.charAt(0)}</div>
                    <div>
                      <strong className="block text-[14px] text-ink">{agent.firstName} {agent.lastName}</strong>
                      <span className="text-[12px] text-[#68736d]">Sales Agent</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
