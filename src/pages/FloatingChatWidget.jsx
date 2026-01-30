import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const BASE_URL = "https://api.houseofresha.com";

export default function AdminChatApp() {
  const adminId = "69427846821bab385d46d2ce";
  const role = "admin";

  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const [messages, setMessages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [msgInput, setMsgInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Presence
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);

  const messagesBoxRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const inputRef = useRef(null);

  /* -------------------- SOCKET -------------------- */
  const socket = useMemo(() => {
    if (!activeConversation) return null;

    const newSocket = io(BASE_URL, {
      auth: {
        userId: adminId,
        role,
        toUser: activeConversation.user._id,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    return newSocket;
  }, [activeConversation]);

  /* -------------------- FETCH CONVERSATIONS -------------------- */
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${BASE_URL}/conversations`);
        const data = await res.json();
        
        if (data.success) {
          setConversations(data.conversations);
          // Calculate total unread
          const unread = data.conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
          setTotalUnread(unread);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
    // Refresh conversations every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  /* -------------------- FETCH HISTORY -------------------- */
  const loadHistory = useCallback(async (conversationId, before = null) => {
    if (isLoadingHistory) return;
    
    setIsLoadingHistory(true);
    
    try {
      let url = `${BASE_URL}/history?conversationId=${conversationId}`;
      if (before) url += `&before=${before}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        if (before) {
          const scrollHeight = messagesBoxRef.current?.scrollHeight || 0;
          setMessages((prev) => [...data.messages, ...prev]);
          
          setTimeout(() => {
            if (messagesBoxRef.current) {
              const newScrollHeight = messagesBoxRef.current.scrollHeight;
              messagesBoxRef.current.scrollTop = newScrollHeight - scrollHeight;
            }
          }, 0);
        } else {
          setMessages(data.messages);
          isInitialLoadRef.current = true;
        }

        setNextCursor(data.nextCursor);
        setHasMore(Boolean(data.nextCursor));
      }
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [isLoadingHistory]);

  /* -------------------- SELECT CONVERSATION -------------------- */
  const handleSelectConversation = async (conv) => {
    if (activeConversation?._id === conv._id) return;
    
    // Reset sending state when switching conversations
    setIsSending(false);
    
    setActiveConversation(conv);
    setMessages([]);
    setNextCursor(null);
    setHasMore(true);
    isInitialLoadRef.current = true;
    await loadHistory(conv._id);
    
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
    );
    setTotalUnread(prev => Math.max(0, prev - (conv.unreadCount || 0)));
  };

  /* -------------------- SOCKET EVENTS -------------------- */
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socket.on("new-message", (msg) => {
      console.log("New message received:", msg);
      
      setMessages((prev) => {
        // Remove any temporary/optimistic message with same text
        const filtered = prev.filter(m => 
          !(m._id.toString().startsWith('temp-') && m.text === msg.text && m.senderRole === msg.senderRole)
        );
        
        // Check if real message already exists
        const exists = filtered.some(m => m._id === msg._id);
        if (exists) return prev;
        
        return [...filtered, msg];
      });

      setConversations((prev) =>
        prev.map((c) => {
          if (c._id === msg.conversation) {
            const isFromOther = msg.senderRole !== role;
            return {
              ...c,
              lastMessage: msg,
              unreadCount: isFromOther && activeConversation?._id !== c._id ? (c.unreadCount || 0) + 1 : 0,
            };
          }
          return c;
        })
      );

      // Update total unread
      if (msg.senderRole !== role && activeConversation?._id !== msg.conversation) {
        setTotalUnread(prev => prev + 1);
      }
    });

    socket.on("online-users", (list) => {
      setOnlineUsers(new Set(list.map(String)));
    });

    socket.on("user-online", ({ userId }) => {
      setOnlineUsers((prev) => new Set([...prev, String(userId)]));
    });

    socket.on("user-offline", ({ userId }) => {
      setOnlineUsers((prev) => {
        const copy = new Set(prev);
        copy.delete(String(userId));
        return copy;
      });
    });

    socket.on("typing", ({ from, isTyping, conversationId }) => {
      if (!activeConversation || conversationId !== activeConversation._id) return;

      setTypingUsers((prev) => ({
        ...prev,
        [String(from)]: isTyping,
      }));

      if (!isTyping) {
        setTimeout(() => {
          setTypingUsers((prev) => {
            const copy = { ...prev };
            delete copy[String(from)];
            return copy;
          });
        }, 1000);
      }
    });

    socket.on("message-sent", (msg) => {
      console.log("Message sent confirmation:", msg);
      // Only update isSending if this message belongs to the active conversation
      if (activeConversation && msg.conversation === activeConversation._id) {
        setIsSending(false);
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      // Only update isSending if this error is from the active conversation
      setIsSending(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("new-message");
      socket.off("online-users");
      socket.off("user-online");
      socket.off("user-offline");
      socket.off("typing");
      socket.off("message-sent");
      socket.off("error");
      socket.disconnect();
    };
  }, [socket, activeConversation, role]);

  /* -------------------- INFINITE SCROLL -------------------- */
  const handleScroll = useCallback(() => {
    if (!messagesBoxRef.current) return;
    
    const { scrollTop } = messagesBoxRef.current;
    
    if (scrollTop === 0 && hasMore && nextCursor && !isLoadingHistory) {
      loadHistory(activeConversation._id, nextCursor);
    }
  }, [hasMore, nextCursor, isLoadingHistory, activeConversation, loadHistory]);

  /* -------------------- SEND MESSAGE -------------------- */
  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!msgInput.trim() || !socket || isSending) return;

    const messageText = msgInput.trim();
    const tempId = `temp-${Date.now()}`;
    
    // Optimistically add message to UI immediately
    const optimisticMessage = {
      _id: tempId,
      text: messageText,
      senderRole: role,
      conversation: activeConversation._id,
      createdAt: new Date().toISOString(),
      sender: adminId,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setMsgInput("");
    setIsSending(true);

    try {
      socket.emit("send-message", {
        text: messageText,
        toUser: activeConversation.user._id,
      });

      socket.emit("typing", {
        conversationId: activeConversation._id,
        isTyping: false,
      });

      // Update conversation list with last message
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConversation._id
            ? { ...c, lastMessage: { text: messageText } }
            : c
        )
      );

      // Focus back on input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter(m => m._id !== tempId));
      setMsgInput(messageText);
      setIsSending(false);
    }
  };

  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    if (isInitialLoadRef.current && messages.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
        isInitialLoadRef.current = false;
      }, 100);
    } else if (!isLoadingHistory && messages.length > 0) {
      const container = messagesBoxRef.current;
      if (container) {
        const isNearBottom = 
          container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        
        if (isNearBottom) {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [messages, isLoadingHistory]);

  /* -------------------- TYPING INDICATOR -------------------- */
  useEffect(() => {
    if (!socket || !activeConversation) return;

    if (msgInput.trim() === "") {
      socket.emit("typing", {
        conversationId: activeConversation._id,
        isTyping: false,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      return;
    }

    socket.emit("typing", {
      conversationId: activeConversation._id,
      isTyping: true,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        conversationId: activeConversation._id,
        isTyping: false,
      });
    }, 3000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [msgInput, socket, activeConversation]);

  /* -------------------- CLEANUP WHEN SWITCHING CONVERSATIONS -------------------- */
  // Add a cleanup effect to reset sending state when socket changes
  useEffect(() => {
    // Reset sending state when socket changes (new conversation selected)
    setIsSending(false);
    
    // Also clear any typing indicators for previous conversation
    setTypingUsers({});
    
    // Clear any typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [socket]);

  /* -------------------- HELPERS -------------------- */
  const isOnline = (uid) => onlineUsers.has(String(uid));
  const isTyping = (uid) => typingUsers[String(uid)];

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleBack = () => {
    setActiveConversation(null);
    setMessages([]);
    setIsSending(false); // Reset sending state when going back
  };

  /* -------------------- UI -------------------- */
  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: "#fff",
            zIndex: 9999,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
          }}
        >
          💬
          {totalUnread > 0 && (
            <span
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                background: "#f44336",
                color: "#fff",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: "bold",
                border: "2px solid #fff",
              }}
            >
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          )}
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 400,
            height: 600,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              padding: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {activeConversation && (
                <button
                  onClick={handleBack}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    color: "#fff",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ←
                </button>
              )}
              <h3 style={{ margin: 0, fontSize: 16 }}>
                {activeConversation
                  ? activeConversation.user.firstName || "User"
                  : "Chats"}
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                width: 30,
                height: 30,
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          {!activeConversation ? (
            // Conversations List
            <div style={{ flex: 1, overflowY: "auto" }}>
              {conversations.length === 0 ? (
                <div
                  style={{
                    padding: 40,
                    textAlign: "center",
                    color: "#999",
                  }}
                >
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    style={{
                      padding: 15,
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      transition: "background 0.2s",
                      background: "#fff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f5f5f5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 5,
                      }}
                    >
                      <strong style={{ fontSize: 14 }}>
                        {conv.user.firstName || "User"}
                        {isOnline(conv.user._id) && (
                          <span
                            style={{
                              color: "#4caf50",
                              marginLeft: 5,
                              fontSize: 12,
                            }}
                          >
                            ●
                          </span>
                        )}
                      </strong>

                      {conv.unreadCount > 0 && (
                        <span
                          style={{
                            background: "#f44336",
                            color: "#fff",
                            borderRadius: "50%",
                            padding: "2px 6px",
                            fontSize: 11,
                            fontWeight: "bold",
                            minWidth: 18,
                            textAlign: "center",
                          }}
                        >
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#666",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {conv.lastMessage?.text || "No messages"}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Chat View
            <>
              {activeConversation && isOnline(activeConversation.user._id) && (
                <div
                  style={{
                    padding: "5px 15px",
                    background: "#e8f5e9",
                    fontSize: 11,
                    color: "#2e7d32",
                    textAlign: "center",
                  }}
                >
                  ● Online
                  {isTyping(activeConversation.user._id) && " • typing..."}
                </div>
              )}

              {/* Messages */}
              <div
                ref={messagesBoxRef}
                onScroll={handleScroll}
                style={{
                  flex: 1,
                  padding: 15,
                  overflowY: "auto",
                  background: "#f0f2f5",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {isLoadingHistory && (
                  <div
                    style={{ textAlign: "center", padding: 10, color: "#666" }}
                  >
                    Loading...
                  </div>
                )}

                {messages.length === 0 && !isLoadingHistory && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: 20,
                      color: "#999",
                      margin: "auto",
                    }}
                  >
                    No messages yet
                  </div>
                )}

                {messages.map((msg, index) => {
                  const isAdmin = msg.senderRole === "admin";
                  const isImage =
                    msg.file && /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.file);
                  const showTime =
                    index === 0 ||
                    new Date(msg.createdAt).getTime() -
                      new Date(messages[index - 1].createdAt).getTime() >
                      300000;

                  return (
                    <div key={msg._id || index}>
                      {showTime && (
                        <div
                          style={{
                            textAlign: "center",
                            fontSize: 10,
                            color: "#999",
                            margin: "10px 0",
                          }}
                        >
                          {formatTime(msg.createdAt)}
                        </div>
                      )}

                      <div
                        style={{
                          textAlign: isAdmin ? "right" : "left",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "inline-block",
                            padding: "8px 12px",
                            borderRadius: 12,
                            background: isAdmin ? "#667eea" : "#fff",
                            color: isAdmin ? "#fff" : "#000",
                            maxWidth: "75%",
                            wordWrap: "break-word",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                            fontSize: 14,
                          }}
                        >
                          {msg.text && (
                            <div style={{ lineHeight: 1.4 }}>{msg.text}</div>
                          )}

                          {msg.file && (
                            <div style={{ marginTop: msg.text ? 8 : 0 }}>
                              {isImage ? (
                                <img
                                  src={`${BASE_URL}/${msg.file}`}
                                  alt="attachment"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: 200,
                                    borderRadius: 8,
                                    display: "block",
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentElement.innerHTML =
                                      "📎 Image failed to load";
                                  }}
                                />
                              ) : (
                                <a
                                  href={`${BASE_URL}/${msg.file}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    color: isAdmin ? "#fff" : "#667eea",
                                    textDecoration: "none",
                                  }}
                                >
                                  📎 Download file
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSend}
                style={{
                  padding: 10,
                  borderTop: "1px solid #ddd",
                  background: "#fff",
                  display: "flex",
                  gap: 8,
                }}
              >
                <input
                  ref={inputRef}
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: 20,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={!msgInput.trim() || isSending}
                  style={{
                    padding: "8px 16px",
                    background:
                      msgInput.trim() && !isSending ? "#667eea" : "#ccc",
                    color: "#fff",
                    border: "none",
                    borderRadius: 20,
                    cursor:
                      msgInput.trim() && !isSending ? "pointer" : "not-allowed",
                    fontSize: 13,
                    fontWeight: "bold",
                  }}
                >
                  {isSending ? "..." : "Send"}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}