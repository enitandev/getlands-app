"use client";
import React, { useState } from 'react';

export default function CustomerMessages() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'agent', text: 'Hello Emeka, welcome to Getlands! I am your dedicated account manager. Let me know if you have any questions about your Abeokuta Land Banking holding.', time: '10:00 AM' },
    { id: 2, sender: 'user', text: 'Thank you! When will I receive my signed MOU?', time: '10:15 AM' },
    { id: 3, sender: 'agent', text: 'Your MOU is currently being processed by our legal team. It will be available in your Documents tab within 24 hours.', time: '10:22 AM' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'user', text: input, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-140px)] lg:h-[calc(100vh-100px)] flex flex-col -mx-[22px] lg:-mx-[60px] -my-[30px] lg:-my-[50px] bg-white border-l border-black/5">
      {/* Header */}
      <div className="h-[70px] border-b border-black/5 flex items-center px-[20px] lg:px-[30px] shrink-0 bg-[#fcfdfc]">
        <div className="flex items-center gap-[15px]">
          <div className="relative">
            <div className="w-[40px] h-[40px] rounded-full bg-[#008b45] flex items-center justify-center text-white font-bold text-[14px]">
              G
            </div>
            <div className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-[#008b45] border-[2px] border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-manrope text-[16px] font-bold text-ink">Getlands Support</h2>
            <p className="text-[11px] text-[#68736d]">Typically replies in a few minutes</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-[20px] lg:p-[30px] space-y-[20px] bg-[#fcfdfc]">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] lg:max-w-[60%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-[15px] rounded-[16px] text-[14px] leading-[1.5] ${
                msg.sender === 'user' 
                  ? 'bg-[#008b45] text-white rounded-tr-[4px]' 
                  : 'bg-[#f3f4f6] text-ink rounded-tl-[4px]'
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-[#7a847f] mt-[5px] mx-[5px]">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-[20px] lg:p-[30px] border-t border-black/5 bg-white shrink-0">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..." 
            className="w-full h-[54px] bg-[#f7f9f7] rounded-full pl-[20px] pr-[60px] outline-none border border-black/5 focus:border-[#008b45] focus:bg-white transition-all text-[14px]"
          />
          <button type="submit" className="absolute right-[6px] top-[6px] w-[42px] h-[42px] bg-[#008b45] rounded-full flex items-center justify-center text-white hover:bg-[#007339] transition-colors disabled:opacity-50" disabled={!input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
