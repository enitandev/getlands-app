"use client";

import React, { useState, useEffect, useRef } from 'react';
import { sendMessageAction, markMessagesAsRead, getOrCreateConversation } from '@/app/actions/messages';

interface ClientAgentMessagesProps {
  currentUser: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  initialConversations: any[];
  referredClients: any[];
  preselectedClientId?: string;
  preselectedConvId?: string;
}

export default function ClientAgentMessages({
  currentUser,
  initialConversations,
  referredClients,
  preselectedClientId,
  preselectedConvId
}: ClientAgentMessagesProps) {
  const [conversations, setConversations] = useState<any[]>(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(() => {
    if (preselectedConvId) {
      const found = initialConversations.find(c => c.id === preselectedConvId);
      if (found) return found.id;
    }
    if (preselectedClientId) {
      const found = initialConversations.find(
        c => c.type === 'agent_client' && c.customerId === preselectedClientId
      );
      if (found) return found.id;
    }
    return initialConversations[0]?.id || null;
  });

  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === selectedConvId);

  // Auto-scroll to latest message and mark as read
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
                  m.senderId !== currentUser.id ? { ...m, read: true } : m
                )
              };
            }
            return c;
          })
        );
      });
    }
  }, [activeConv?.messages?.length, activeConv?.id, currentUser.id]);

  // Polling for active conversation and background conversation updates
  useEffect(() => {
    let isMounted = true;

    const poll = async () => {
      if (!selectedConvId) return;
      try {
        const { getLatestMessages } = await import('@/app/actions/polling');
        const latest = await getLatestMessages(selectedConvId);
        if (latest && isMounted) {
          setConversations(prev =>
            prev.map(c => {
              if (c.id === selectedConvId) {
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
        console.error("Polling error in ClientAgentMessages:", err);
      }
    };

    const interval = setInterval(poll, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedConvId]);

  const handleSend = async (textToSend?: string) => {
    const messageText = (textToSend !== undefined ? textToSend : input).trim();
    if (!messageText || !activeConv || isSending) return;

    const tempId = `temp-${Date.now()}`;
    const newMsg = {
      id: tempId,
      text: messageText,
      senderId: currentUser.id,
      conversationId: activeConv.id,
      createdAt: new Date().toISOString(),
      read: false
    };

    // Optimistic update
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

  const handleStartChatWithClient = async (clientId: string) => {
    setIsCreatingChat(true);
    try {
      const res = await getOrCreateConversation('agent_client', clientId);
      if (res.success && res.conversation) {
        const newConv = res.conversation;
        setConversations(prev => {
          const exists = prev.some(c => c.id === newConv.id);
          if (exists) return prev;
          return [newConv, ...prev];
        });
        setSelectedConvId(newConv.id);
        setShowNewChatModal(false);
      }
    } catch (e) {
      console.error("Error creating chat:", e);
    } finally {
      setIsCreatingChat(false);
    }
  };

  // Contacts / conversations filtering
  const filteredConversations = conversations.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const isSupport = c.type === 'support' || c.customerId === currentUser.id;
    if (isSupport && 'getlands support desk brokerage'.includes(q)) return true;

    const otherUser = c.customerId === currentUser.id ? c.agent : c.customer;
    const name = `${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`.toLowerCase();
    const email = (otherUser?.email || '').toLowerCase();
    const lastMsg = c.messages?.[c.messages.length - 1]?.text?.toLowerCase() || '';

    return name.includes(q) || email.includes(q) || lastMsg.includes(q);
  });

  // Calculate clients who don't have an open thread yet
  const existingClientIds = new Set(
    conversations
      .filter(c => c.type === 'agent_client')
      .map(c => c.customerId)
  );

  const availableClientsToMessage = referredClients.filter(
    client => !existingClientIds.has(client.id)
  );

  // Quick reply suggestions for the agent
  const quickReplies = [
    "Hello! How can I assist you with your land acquisition today?",
    "Great news! Your allocation documents are currently being processed.",
    "Would you like to schedule an on-site inspection for our newest phase?"
  ];

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* LEFT COLUMN: Conversation List */}
      <div
        className={`${
          selectedConvId ? 'hidden lg:flex' : 'flex'
        } w-full lg:w-[360px] xl:w-[400px] border-r border-black/5 flex-col bg-[#fcfdfc] shrink-0 h-full`}
      >
        {/* Sidebar Header & Search */}
        <div className="p-[18px] border-b border-black/5 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-manrope text-[17px] font-bold text-ink">Conversations</h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="inline-flex items-center gap-1.5 px-[12px] py-[6px] bg-[#008b45] hover:bg-[#007339] text-white text-[12px] font-bold rounded-full transition-all shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Message
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search clients or messages..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#f7f9f7] border border-black/5 rounded-[12px] pl-[36px] pr-[14px] py-[8px] text-[13px] text-ink placeholder-[#7a847f] focus:outline-none focus:border-[#008b45] transition-all"
            />
            <svg
              className="absolute left-[12px] top-[10px] text-[#7a847f]"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Conversations Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-black/5">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-[48px] h-[48px] rounded-full bg-[#eef3ef] text-[#008b45] flex items-center justify-center mx-auto mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <p className="text-[14px] font-bold text-ink mb-1">No chats found</p>
              <p className="text-[12px] text-[#68736d] mb-4">Start messaging any of your registered clients.</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="px-4 py-2 bg-[#008b45] text-white text-[12px] font-bold rounded-full hover:bg-[#007339] transition-colors"
              >
                Message a Client
              </button>
            </div>
          ) : (
            filteredConversations.map(conv => {
              const isSupport = conv.type === 'support' || conv.customerId === currentUser.id;
              const otherUser = isSupport ? null : conv.customer;
              const displayName = isSupport
                ? 'Getlands Brokerage / Support Desk'
                : `${otherUser?.firstName || 'Client'} ${otherUser?.lastName || ''}`;
              const initials = isSupport
                ? 'GL'
                : `${otherUser?.firstName?.[0] || 'C'}${otherUser?.lastName?.[0] || ''}`;

              const msgs = conv.messages || [];
              const lastMsg = msgs[msgs.length - 1];
              const unreadCount = msgs.filter(
                (m: any) => !m.read && m.senderId !== currentUser.id
              ).length;
              const isSelected = conv.id === selectedConvId;

              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full text-left p-[16px] transition-all flex items-start gap-3.5 hover:bg-black/[0.02] ${
                    isSelected ? 'bg-white border-l-4 border-l-[#008b45] shadow-xs' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-[44px] h-[44px] rounded-full flex items-center justify-center font-manrope font-bold text-[14px] ${
                        isSupport
                          ? 'bg-[#18201c] text-white'
                          : 'bg-[#eef3ef] text-[#008b45]'
                      }`}
                    >
                      {initials}
                    </div>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#008b45] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`text-[14px] truncate font-manrope ${
                          unreadCount > 0 ? 'font-bold text-ink' : 'font-semibold text-ink/90'
                        }`}
                      >
                        {displayName}
                      </h3>
                      {lastMsg && (
                        <span className="text-[11px] text-[#7a847f] shrink-0 ml-2">
                          {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12px] text-[#68736d] truncate">
                        {lastMsg ? lastMsg.text : 'No messages yet'}
                      </p>
                      {isSupport && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#18201c]/10 text-[#18201c]">
                          Support
                        </span>
                      )}
                      {!isSupport && otherUser?.holdings?.length > 0 && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-[#008b45]">
                          Investor
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Active Chat or Empty State */}
      <div
        className={`${
          selectedConvId ? 'flex' : 'hidden lg:flex'
        } flex-1 flex-col h-full bg-[#f7f9f7] overflow-hidden`}
      >
        {activeConv ? (
          <>
            {/* Chat Header */}
            {(() => {
              const isSupport =
                activeConv.type === 'support' || activeConv.customerId === currentUser.id;
              const otherUser = isSupport ? null : activeConv.customer;
              const displayName = isSupport
                ? 'Getlands Brokerage / Support Desk'
                : `${otherUser?.firstName || 'Client'} ${otherUser?.lastName || ''}`;
              const phone = otherUser?.phoneNumber;

              return (
                <div className="p-[16px] lg:px-[24px] border-b border-black/5 bg-white flex items-center justify-between shrink-0 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConvId(null)}
                      className="lg:hidden p-1.5 -ml-2 rounded-lg text-ink hover:bg-black/5"
                      title="Back to list"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>

                    <div
                      className={`w-[40px] h-[40px] rounded-full flex items-center justify-center font-manrope font-bold text-[13px] ${
                        isSupport
                          ? 'bg-[#18201c] text-white'
                          : 'bg-[#eef3ef] text-[#008b45]'
                      }`}
                    >
                      {isSupport
                        ? 'GL'
                        : `${otherUser?.firstName?.[0] || 'C'}${otherUser?.lastName?.[0] || ''}`}
                    </div>

                    <div>
                      <h2 className="font-manrope text-[15px] font-bold text-ink leading-tight flex items-center gap-2">
                        {displayName}
                        {isSupport ? (
                          <span className="text-[10px] bg-black/5 px-2 py-0.5 rounded-full font-bold text-ink/70">
                            Official Support
                          </span>
                        ) : (
                          <span className="text-[10px] bg-[#eef3ef] text-[#008b45] px-2 py-0.5 rounded-full font-bold">
                            Referred Client
                          </span>
                        )}
                      </h2>
                      <p className="text-[11px] text-[#008b45] font-semibold flex items-center gap-1.5 mt-0.5">
                        <span className="w-[6px] h-[6px] rounded-full bg-[#008b45] animate-pulse"></span>
                        Active in portal
                      </p>
                    </div>
                  </div>

                  {/* Actions / Contact Shortcuts */}
                  {!isSupport && phone && (
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[12px] font-bold border border-emerald-200 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.83.829 2.791.829 3.182 0 5.768-2.587 5.768-5.766 0-3.181-2.586-5.765-5.768-5.765zm8.384 5.766c0 4.629-3.766 8.396-8.384 8.396-.998 0-2.22-.249-3.324-.764l-4.707 1.235 1.258-4.595c-.636-1.1-1.011-2.353-1.011-3.672 0-4.63 3.767-8.397 8.384-8.397 4.618 0 8.384 3.767 8.384 8.397z"/>
                        </svg>
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${phone}`}
                        className="p-2 rounded-full bg-[#f7f9f7] text-ink hover:bg-black/5 border border-black/5 transition-colors"
                        title={`Call ${phone}`}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Messages Scroll Body */}
            <div className="flex-1 overflow-y-auto p-[20px] lg:p-[28px] space-y-[18px]">
              {(activeConv.messages || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-[56px] h-[56px] rounded-full bg-white border border-black/5 shadow-xs flex items-center justify-center text-[#008b45] mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <h3 className="font-manrope text-[16px] font-bold text-ink mb-1">
                    Direct Channel Ready
                  </h3>
                  <p className="text-[13px] text-[#68736d] max-w-[340px] mb-4">
                    Send a message to introduce yourself or share updates regarding land deals, allocations, and documentation.
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
                  const isMe = msg.senderId === currentUser.id;

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

            {/* Quick replies pills */}
            <div className="px-[20px] py-[8px] bg-white/70 border-t border-black/5 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[11px] font-bold text-[#7a847f] shrink-0">Quick reply:</span>
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

            {/* Chat Input Bar */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="p-[16px] lg:p-[20px] bg-white border-t border-black/5 shrink-0 flex items-center gap-3"
            >
              <input
                type="text"
                placeholder="Type your message..."
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
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-[64px] h-[64px] rounded-full bg-[#eef3ef] text-[#008b45] flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="font-manrope text-[18px] font-bold text-ink mb-1">
              Select a Conversation
            </h3>
            <p className="text-[13px] text-[#68736d] max-w-[340px] mb-5">
              Choose a client from the left or reach out to Getlands Brokerage Desk for assistance.
            </p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-5 py-2.5 bg-[#008b45] text-white font-manrope font-bold text-[13px] rounded-full hover:bg-[#007339] shadow-sm transition-colors"
            >
              Start New Client Chat
            </button>
          </div>
        )}
      </div>

      {/* START NEW CHAT MODAL */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[24px] max-w-[480px] w-full p-6 shadow-xl border border-black/5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div>
                <h3 className="font-manrope text-[18px] font-bold text-ink">Message a Client</h3>
                <p className="text-[12px] text-[#68736d]">Select a referred client to start a direct message thread.</p>
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 rounded-full text-[#7a847f] hover:text-ink hover:bg-black/5 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 divide-y divide-black/5">
              {referredClients.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[14px] text-ink font-bold mb-1">No referred clients yet</p>
                  <p className="text-[12px] text-[#68736d]">Share your referral link to onboard clients.</p>
                </div>
              ) : (
                referredClients.map(client => {
                  const hasOpenThread = existingClientIds.has(client.id);
                  const initials = `${client.firstName?.[0] || 'C'}${client.lastName?.[0] || ''}`;

                  return (
                    <div
                      key={client.id}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-[#f7f9f7] px-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-[38px] h-[38px] rounded-full bg-[#eef3ef] text-[#008b45] font-manrope font-bold text-[13px] flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-ink truncate">
                            {client.firstName} {client.lastName}
                          </p>
                          <p className="text-[11px] text-[#68736d] truncate">
                            {client.email || client.phoneNumber || 'Registered Client'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartChatWithClient(client.id)}
                        disabled={isCreatingChat}
                        className="px-3.5 py-1.5 bg-[#008b45] hover:bg-[#007339] text-white text-[12px] font-bold rounded-full transition-all shrink-0 shadow-2xs"
                      >
                        {hasOpenThread ? 'Open Chat' : 'Start Chat'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-black/5 flex justify-end">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="px-4 py-2 text-[13px] font-bold text-[#68736d] hover:text-ink transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
