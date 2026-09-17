"use client";
import React, { useState } from 'react';

export default function AdminMessages() {
  const [activeChat, setActiveChat] = useState('1');
  const [input, setInput] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const inbox = [
    { id: '1', name: 'Emeka Abraham', message: 'Thank you! When will I receive my...', time: '10:15 AM', unread: 2, online: true },
    { id: '2', name: 'David Smith', message: 'Is the Tomato farm cycle still open?', time: 'Yesterday', unread: 0, online: false },
    { id: '3', name: 'Ngozi Okoro', message: 'I transferred the funds to the Monie...', time: 'Yesterday', unread: 0, online: false },
  ];

  const activeMessages = [
    { id: 1, sender: 'agent', text: 'Hello Emeka, welcome to Getlands! I am your dedicated account manager. Let me know if you have any questions about your Abeokuta Land Banking holding.', time: '10:00 AM' },
    { id: 2, sender: 'user', text: 'Thank you! When will I receive my signed MOU?', time: '10:15 AM' },
    { id: 3, sender: 'agent', text: 'Your MOU is currently being processed by our legal team. It will be available in your Documents tab within 24 hours.', time: '10:22 AM' }
  ];

  return (
    <div className="flex h-full bg-white">
      {/* Left Pane: Inbox List */}
      <div className="w-full lg:w-[350px] border-r border-black/5 flex flex-col shrink-0">
        <div className="p-[20px] border-b border-black/5 flex justify-between items-center bg-[#fcfdfc]">
          <h2 className="font-manrope text-[18px] font-bold text-ink tracking-[-0.03em]">Support Inbox</h2>
          <button className="text-[13px] text-[#008b45] font-bold">Mark all read</button>
        </div>
        
        <div className="p-[15px] border-b border-black/5 bg-[#fcfdfc]">
          <div className="relative">
            <svg className="absolute left-[12px] top-[10px] text-[#a1aba6]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Search customers..." className="w-full h-[36px] bg-[#eef3ef] rounded-full pl-[36px] pr-[15px] outline-none text-[13px] border border-transparent focus:border-[#008b45]" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {inbox.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)}
              className={`p-[15px_20px] cursor-pointer flex items-center gap-[15px] border-b border-black/5 transition-colors ${activeChat === chat.id ? 'bg-[#eef3ef]/50' : 'hover:bg-[#fcfdfc]'}`}
            >
              <div className="relative">
                <div className="w-[44px] h-[44px] rounded-full bg-[#f7f9f7] flex items-center justify-center text-[#008b45] font-bold text-[16px] shrink-0 border border-black/5">
                  {chat.name.charAt(0)}
                </div>
                {chat.online && <div className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-[#008b45] border-[2px] border-white rounded-full"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-[4px]">
                  <strong className={`block text-[14px] truncate ${chat.unread > 0 ? 'text-ink font-extrabold' : 'text-[#4a554f]'}`}>{chat.name}</strong>
                  <span className={`text-[11px] whitespace-nowrap ${chat.unread > 0 ? 'text-[#008b45] font-bold' : 'text-[#a1aba6]'}`}>{chat.time}</span>
                </div>
                <div className="flex justify-between items-center gap-[10px]">
                  <span className={`text-[12px] truncate ${chat.unread > 0 ? 'text-ink font-bold' : 'text-[#68736d]'}`}>{chat.message}</span>
                  {chat.unread > 0 && (
                    <span className="w-[18px] h-[18px] rounded-full bg-[#f5a623] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane: Active Chat */}
      <div className="hidden lg:flex flex-col flex-1 bg-[#fcfdfc]">
        {/* Chat Header */}
        <div className="h-[70px] border-b border-black/5 flex items-center justify-between px-[30px] shrink-0 bg-white">
          <div className="flex items-center gap-[15px]">
            <div className="w-[36px] h-[36px] rounded-full bg-[#f7f9f7] flex items-center justify-center text-[#008b45] font-bold text-[14px]">
              E
            </div>
            <div>
              <strong className="block text-[15px] text-ink font-manrope">Emeka Abraham</strong>
              <span className="text-[11px] text-[#008b45] font-bold flex items-center gap-[4px]">
                <span className="w-[6px] h-[6px] rounded-full bg-[#008b45]"></span> Online
              </span>
            </div>
          </div>
          <div className="flex gap-[10px]">
            <button className="px-[16px] py-[8px] bg-white border border-black/10 text-ink text-[12px] font-bold rounded-full hover:bg-[#f7f9f7] transition-colors">
              View Profile
            </button>
            <button onClick={() => setIsAssignModalOpen(true)} className="px-[16px] py-[8px] bg-white border border-black/10 text-[#008b45] text-[12px] font-bold rounded-full hover:bg-[#eef3ef] transition-colors">
              Assign Agent
            </button>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-[30px] space-y-[20px]">
          {activeMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] flex flex-col ${msg.sender === 'agent' ? 'items-end' : 'items-start'}`}>
                <div className={`p-[15px] rounded-[16px] text-[14px] leading-[1.5] shadow-sm ${
                  msg.sender === 'agent' 
                    ? 'bg-[#008b45] text-white rounded-tr-[4px]' 
                    : 'bg-white border border-black/5 text-ink rounded-tl-[4px]'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-[#7a847f] mt-[5px] mx-[5px]">
                  {msg.time} {msg.sender === 'agent' && '• Sent by You'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input Area */}
        <div className="p-[20px] bg-white border-t border-black/5 shrink-0">
          <form className="relative flex gap-[10px]" onSubmit={(e) => { e.preventDefault(); setInput(''); }}>
            <button type="button" className="w-[50px] h-[50px] rounded-full bg-[#f7f9f7] flex items-center justify-center text-[#7a847f] hover:bg-[#eef3ef] hover:text-ink transition-colors shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your reply to Emeka..." 
              className="flex-1 h-[50px] bg-[#f7f9f7] rounded-full px-[20px] outline-none border border-black/5 focus:border-[#008b45] focus:bg-white transition-all text-[14px]"
            />
            <button type="submit" disabled={!input.trim()} className="w-[50px] h-[50px] rounded-full bg-[#008b45] flex items-center justify-center text-white hover:bg-[#007339] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      </div>

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
              <p className="text-[13px] text-[#68736d] mb-[10px]">Select a sales agent to handle Emeka&apos;s inquiry.</p>
              
              <div className="space-y-[10px]">
                <button className="w-full p-[15px] border border-black/10 rounded-[12px] flex items-center gap-[15px] hover:border-[#008b45] hover:bg-[#eef3ef]/30 transition-all text-left">
                  <div className="w-[36px] h-[36px] rounded-full bg-[#008b45] text-white flex items-center justify-center font-bold text-[14px]">S</div>
                  <div>
                    <strong className="block text-[14px] text-ink">Samuel Peters</strong>
                    <span className="text-[12px] text-[#68736d]">12 Active Leads</span>
                  </div>
                </button>
                <button className="w-full p-[15px] border border-black/10 rounded-[12px] flex items-center gap-[15px] hover:border-[#008b45] hover:bg-[#eef3ef]/30 transition-all text-left">
                  <div className="w-[36px] h-[36px] rounded-full bg-[#008b45] text-white flex items-center justify-center font-bold text-[14px]">J</div>
                  <div>
                    <strong className="block text-[14px] text-ink">Joy Essien</strong>
                    <span className="text-[12px] text-[#68736d]">8 Active Leads</span>
                  </div>
                </button>
              </div>
            </div>
            <div className="p-[20px] border-t border-black/5 bg-[#fcfdfc] flex justify-end">
              <button onClick={() => setIsAssignModalOpen(false)} className="px-[20px] py-[10px] bg-[#008b45] text-white text-[13px] font-bold rounded-full hover:bg-[#007339] transition-colors">
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
