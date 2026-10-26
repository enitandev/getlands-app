"use client";

import React, { useState, useEffect, useRef } from 'react';
import { sendMessageAction, markMessagesAsRead } from '@/app/actions/messages';

interface ClientMessagesProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  initialConversations: any[];
  advisor: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  } | null;
  preselectedConvId?: string;
}

export default function ClientMessages({
  user,
  initialConversations,
  advisor,
  preselectedConvId
}: ClientMessagesProps) {
  const [conversations, setConversations] = useState<any[]>(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(() => {
    if (preselectedConvId) {
      const found = initialConversations.find(c => c.id === preselectedConvId);
      if (found) return found.id;
    }
    // Prefer advisor conversation if available, or first conversation
    return initialConversations[0]?.id || null;
  });

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (activeConv?.id) {
      markMessagesAsRead(activeConv.id).then(() => {
        setConversations(prev =>
          prev.map(c => {
            if (c.id === activeConv.id) {
              return {
                ...c,
                messages: (c.messages || []).map((m: any) =>
                  m.senderId !== user.id ? { ...m, read: true } : m
                )
              };
            }
            return c;
          })
        );
      });
    }
  }, [activeConv?.messages?.length, activeConv?.id, user.id]);

  // Polling for active conversation messages
  useEffect(() => {
    if (!activeConv?.id) return;

    let isMounted = true;
    const fetchLatestMessages = async () => {
      try {
        const { getLatestMessages } = await import('@/app/actions/polling');
        const latest = await getLatestMessages(activeConv.id);
        if (latest && isMounted) {
          setConversations(prev =>
            prev.map(c => {
              if (c.id === activeConv.id) {
                const currentLen = c.messages?.length || 0;
                const latestLen = latest.length;
                if (
                  latestLen !== currentLen ||
                  (latestLen > 0 &&
                    currentLen > 0 &&
                    latest[latestLen - 1].id !== c.messages[currentLen - 1].id)
                ) {
                  return { ...c, messages: latest };
                }
              }
              return c;
            })
          );
        }
      } catch (err) {
        console.error("Polling error in ClientMessages:", err);
      }
    };

    const intervalId = setInterval(fetchLatestMessages, 4000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [activeConv?.id]);

  const handleSend = async (textToSend?: string) => {
    const messageText = (textToSend !== undefined ? textToSend : input).trim();
    if (!messageText || !activeConv || isSending) return;

    const tempId = `temp-${Date.now()}`;
    const newMsg = {
      id: tempId,
      text: messageText,
      senderId: user.id,
      conversationId: activeConv.id,
      createdAt: new Date().toISOString(),
      read: false
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            updatedAt: new Date().toISOString(),
            messages: [...(c.messages || []), newMsg]
          };
        }
        return c;
      })
    );

    if (textToSend === undefined) {
      setInput('');
    }
    setIsSending(true);

    try {
      const res = await sendMessageAction(activeConv.id, messageText);
      if (res.success && res.message) {
        setConversations(prev =>
          prev.map(c => {
            if (c.id === activeConv.id) {
              return {
                ...c,
                messages: c.messages.map((m: any) =>
                  m.id === tempId ? res.message : m
                )
              };
            }
            return c;
          })
        );
      }
    } catch (e) {
      console.error("Failed to send message:", e);
    } finally {
      setIsSending(false);
    }
  };

  const isAdvisorThread = activeConv?.type === 'agent_client';
  const assignedAgent = activeConv?.agent || advisor;

  const quickReplies = isAdvisorThread
    ? [
        "Hello! I'm interested in inspecting the new phase this weekend.",
        "Could you guide me on the installment payment breakdown?",
        "When will my survey and allocation plan be ready?"
      ]
    : [
        "Hello Support, I have a question regarding my transaction status.",
        "Could you please clarify the deed of assignment verification process?",
        "How do I update my next of kin information?"
      ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* CHANNEL SELECTOR TABS */}
      <div className="p-[14px] lg:px-[24px] border-b border-black/5 bg-[#fcfdfc] flex items-center justify-between gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          {conversations.map(conv => {
            const isAdvisor = conv.type === 'agent_client';
            const isSelected = conv.id === activeConv?.id;
            const unread = (conv.messages || []).filter(
              (m: any) => !m.read && m.senderId !== user.id
            ).length;

            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] font-manrope font-bold transition-all ${
                  isSelected
                    ? 'bg-[#008b45] text-white shadow-xs'
                    : 'bg-white border border-black/10 text-ink/80 hover:border-[#008b45]/50'
                }`}
              >
                <span
                  className={`w-[7px] h-[7px] rounded-full ${
                    isSelected ? 'bg-white' : 'bg-[#008b45]'
                  }`}
                />
                <span>
                  {isAdvisor
                    ? `Advisor (${assignedAgent?.firstName || 'Assigned'})`
                    : 'Getlands Helpdesk'}
                </span>
                {unread > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white text-[#008b45]'
                        : 'bg-[#008b45] text-white'
                    }`}
                  >
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Contact shortcuts for advisor */}
        {isAdvisorThread && assignedAgent?.phoneNumber && (
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${assignedAgent.phoneNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[12px] font-bold border border-emerald-200 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.83.829 2.791.829 3.182 0 5.768-2.587 5.768-5.766 0-3.181-2.586-5.765-5.768-5.765zm8.384 5.766c0 4.629-3.766 8.396-8.384 8.396-.998 0-2.22-.249-3.324-.764l-4.707 1.235 1.258-4.595c-.636-1.1-1.011-2.353-1.011-3.672 0-4.63 3.767-8.397 8.384-8.397 4.618 0 8.384 3.767 8.384 8.397z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${assignedAgent.phoneNumber}`}
              className="p-2 rounded-full bg-[#f7f9f7] text-ink hover:bg-black/5 border border-black/5 transition-colors"
              title={`Call ${assignedAgent.phoneNumber}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* CHAT HEADER INFO */}
      <div className="px-[20px] py-[14px] bg-white border-b border-black/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-[40px] h-[40px] rounded-full flex items-center justify-center font-manrope font-bold text-[14px] ${
              isAdvisorThread
                ? 'bg-[#eef3ef] text-[#008b45]'
                : 'bg-[#18201c] text-white'
            }`}
          >
            {isAdvisorThread
              ? `${assignedAgent?.firstName?.[0] || 'A'}${assignedAgent?.lastName?.[0] || ''}`
              : 'GL'}
          </div>
          <div>
            <h2 className="font-manrope text-[15px] font-bold text-ink leading-tight">
              {isAdvisorThread
                ? `${assignedAgent?.firstName || 'Assigned'} ${assignedAgent?.lastName || 'Advisor'}`
                : 'Getlands Helpdesk & Brokerage'}
            </h2>
            <p className="text-[11px] text-[#008b45] font-semibold flex items-center gap-1.5 mt-0.5">
              <span className="w-[6px] h-[6px] rounded-full bg-[#008b45] animate-pulse"></span>
              {isAdvisorThread ? 'Personal Property Advisor • Online' : 'Official Support Desk • Active'}
            </p>
          </div>
        </div>
      </div>

      {/* MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-[20px] lg:p-[28px] space-y-[18px] bg-[#f7f9f7]">
        {(!activeConv?.messages || activeConv.messages.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-[56px] h-[56px] rounded-full bg-white border border-black/5 shadow-xs flex items-center justify-center text-[#008b45] mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="font-manrope text-[16px] font-bold text-ink mb-1">
              {isAdvisorThread ? 'Chat with Your Property Advisor' : 'Getlands Customer Support'}
            </h3>
            <p className="text-[13px] text-[#68736d] max-w-[340px] mb-4">
              {isAdvisorThread
                ? 'Ask about verified land listings, site inspections, and your title documents.'
                : 'Need help with payments, KYC verification, or wallet withdrawals? Message our team directly.'}
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-[480px]">
              {quickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qr)}
                  className="text-[12px] bg-white border border-black/10 hover:border-[#008b45] text-ink px-3 py-1.5 rounded-full transition-all text-left shadow-2xs hover:shadow-xs"
                >
                  "{qr}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          (activeConv.messages || []).map((msg: any) => {
            const isMe = msg.senderId === user.id;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] flex flex-col ${
                    isMe ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`p-[14px] lg:p-[16px] text-[14px] leading-relaxed shadow-xs whitespace-pre-wrap ${
                      isMe
                        ? 'bg-[#008b45] text-white rounded-[20px] rounded-tr-[4px]'
                        : 'bg-white border border-black/5 text-ink rounded-[20px] rounded-tl-[4px]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#7a847f] mt-[4px] px-[6px]">
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {isMe && (
                      <span title={msg.read ? "Read" : "Delivered"}>
                        {msg.read ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK SUGGESTIONS */}
      <div className="px-[20px] py-[8px] bg-white/80 border-t border-black/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-bold text-[#7a847f] shrink-0">Prompt:</span>
        {quickReplies.map((qr, idx) => (
          <button
            key={idx}
            onClick={() => setInput(qr)}
            className="shrink-0 text-[11px] bg-white border border-black/10 hover:border-[#008b45] text-ink/80 px-2.5 py-1 rounded-full transition-colors whitespace-nowrap"
          >
            {qr.substring(0, 32)}...
          </button>
        ))}
      </div>

      {/* INPUT BAR */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="p-[16px] lg:p-[20px] bg-white border-t border-black/5 shrink-0 flex items-center gap-3"
      >
        <input
          type="text"
          placeholder={
            isAdvisorThread
              ? `Message ${assignedAgent?.firstName || 'your Advisor'}...`
              : "Message Getlands Helpdesk..."
          }
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isSending}
          className="flex-1 bg-[#f7f9f7] border border-black/10 rounded-full px-[20px] py-[12px] text-[14px] text-ink placeholder-[#7a847f] focus:outline-none focus:border-[#008b45] transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="w-[46px] h-[46px] bg-[#008b45] hover:bg-[#007339] disabled:opacity-40 disabled:hover:bg-[#008b45] text-white rounded-full flex items-center justify-center transition-all shadow-sm shrink-0"
          title="Send message"
        >
          {isSending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="translate-x-[1px]">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
