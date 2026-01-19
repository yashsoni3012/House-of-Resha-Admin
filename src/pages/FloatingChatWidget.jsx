import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { X, Send, Minimize2, Circle } from "lucide-react";

const BASE_URL = "https://api.houseofresha.com";

const FloatingChatWidget = () => {
  const adminId = "69427846821bab385d46d2ce";
  const role = "admin";

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");

  // WebSocket states
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const messagesBoxRef = useRef(null);
  const bottomRef = useRef(null);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return conversations.reduce(
      (sum, conv) => sum + (conv.unreadCount || 0),
      0,
    );
  }, [conversations]);

  /* -------------------- SOCKET -------------------- */
  const socket = useMemo(() => {
    if (!selectedChat) return null;

    return io(BASE_URL, {
      auth: {
        userId: adminId,
        role,
        toUser: selectedChat.user._id,
      },
    });
  }, [selectedChat]);

  /* -------------------- FETCH CONVERSATIONS -------------------- */
  useEffect(() => {
    if (!isOpen) return;

    setIsLoadingConversations(true);
    fetch(`${BASE_URL}/conversations`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setConversations(data.conversations);
      })
      .catch(console.error)
      .finally(() => setIsLoadingConversations(false));
  }, [isOpen]);

  /* -------------------- FETCH HISTORY -------------------- */
  const loadHistory = async (conversationId, before = null) => {
    if (!conversationId) return;

    let url = `${BASE_URL}/history?conversationId=${conversationId}`;
    if (before) url += `&before=${before}`;

    try {
      setIsLoadingMessages(true);
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        if (before) {
          setMessages((prev) => [...data.messages, ...prev]);
        } else {
          setMessages(data.messages);
        }

        setNextCursor(data.nextCursor);
        setHasMore(Boolean(data.nextCursor));
      }
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  /* -------------------- SELECT CONVERSATION -------------------- */
  const handleChatSelect = async (conv) => {
    setSelectedChat(conv);
    setIsMinimized(false);
    setMessages([]);
    setNextCursor(null);
    setHasMore(true);
    setIsLoadingMessages(true);
    await loadHistory(conv._id);

    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c)),
    );
  };

  /* -------------------- HANDLE BACK -------------------- */
  const handleBack = () => {
    if (socket) {
      socket.disconnect();
    }
    setSelectedChat(null);
    setMessages([]);
  };

  /* -------------------- SOCKET EVENTS -------------------- */
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => console.log("Connected to chat"));

    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);

      // Update conversations list
      setConversations((prev) =>
        prev.map((c) => {
          if (c._id === msg.conversation) {
            return {
              ...c,
              lastMessage: msg,
              unreadCount:
                selectedChat?._id === msg.conversation
                  ? 0
                  : (c.unreadCount || 0) + 1,
            };
          }
          return c;
        }),
      );
    });

    socket.on("online-users", (list) => {
      setOnlineUsers(new Set(list.map(String)));
    });

    socket.on("user-online", ({ userId }) => {
      setOnlineUsers((p) => new Set([...p, String(userId)]));
    });

    socket.on("user-offline", ({ userId }) => {
      setOnlineUsers((p) => {
        const copy = new Set(p);
        copy.delete(String(userId));
        return copy;
      });
    });

    socket.on("typing", ({ from, isTyping }) => {
      setTypingUsers((p) => ({
        ...p,
        [from]: isTyping,
      }));
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket, selectedChat]);

  /* -------------------- INFINITE SCROLL -------------------- */
 const handleScroll = () => {
  const el = messagesBoxRef.current;
  if (!el) return;

  // Check if user is near bottom
  const nearBottom =
    el.scrollHeight - el.scrollTop - el.clientHeight < 100;

  setIsAtBottom(nearBottom);

  // Load older messages only when scrolling to top
  if (el.scrollTop === 0 && hasMore && nextCursor && !isLoadingMessages) {
    loadHistory(selectedChat._id, nextCursor);
  }
};


  /* -------------------- SEND MESSAGE -------------------- */
  const handleSendMessage = (e) => {
  if (e) e.preventDefault();
  if (!message.trim() || !socket || !selectedChat) return;

  socket.emit("send-message", {
    text: message,
    toUser: selectedChat.user._id,
  });

  setMessage("");
};


  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    if (messagesBoxRef.current && messages.length > 0 && !isLoadingMessages) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isLoadingMessages]);

  /* -------------------- HELPERS -------------------- */
  const isOnline = (uid) => onlineUsers.has(String(uid));
  const isTyping = (uid) => typingUsers[String(uid)];

  /* -------------------- FORMAT TIME -------------------- */
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  /* -------------------- GET AVATAR INITIAL -------------------- */
  const getAvatar = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  /* -------------------- FORMAT LAST MESSAGE TIME -------------------- */
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50">
      {/* Floating Chat Button - Smaller on mobile */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-3 sm:p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 group"
        >
          <svg
            className="w-5 h-5 sm:w-7 sm:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>

          {/* Unread Badge - Smaller on mobile */}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}

          <span className="absolute inset-0 rounded-full bg-purple-400 opacity-0 group-hover:opacity-30 group-hover:animate-ping"></span>
        </button>
      )}

      {/* Chat Panel - Optimized for mobile */}
      {isOpen && (
        <div
          className={`bg-white rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized
              ? "w-64 sm:w-80 h-14 sm:h-16"
              : "w-[90vw] sm:w-96 h-[85vh] sm:h-[600px] max-w-sm"
          } flex flex-col overflow-hidden`}
        >
          {/* Header - Compact on mobile */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2.5 sm:p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              {selectedChat && (
                <button
                  onClick={handleBack}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors flex-shrink-0"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              <div className="w-7 h-7 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center text-base sm:text-xl flex-shrink-0">
                💬
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-xs sm:text-lg truncate">
                  {selectedChat ? selectedChat.user.firstName : "Messages"}
                </h3>
                <p className="text-[10px] sm:text-xs text-white/80 truncate">
                  {selectedChat
                    ? isOnline(selectedChat.user._id)
                      ? "Online"
                      : "Offline"
                    : `${unreadCount} unread`}
                </p>
              </div>
            </div>
            <div className="flex gap-0.5 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/20 rounded-full p-1 sm:p-2 transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedChat(null);
                  setIsMinimized(false);
                  if (socket) socket.disconnect();
                }}
                className="hover:bg-white/20 rounded-full p-1 sm:p-2 transition-colors"
              >
                <X className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat List View - Compact on mobile */}
              {!selectedChat ? (
                <div className="flex-1 overflow-y-auto">
                  {isLoadingConversations ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600"></div>
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-3 sm:p-4 text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 text-gray-400">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium text-sm sm:text-base">
                        No conversations yet
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
                        When customers message you, they'll appear here
                      </p>
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <button
                        key={conv._id}
                        onClick={() => handleChatSelect(conv)}
                        className="w-full p-2.5 sm:p-4 hover:bg-gray-50 transition-colors flex items-start gap-2 sm:gap-3 border-b border-gray-100"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                            {getAvatar(conv.user.firstName)}
                          </div>
                          {isOnline(conv.user._id) && (
                            <Circle className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 fill-green-500 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex justify-between items-start mb-0.5 sm:mb-1 gap-2">
                            <h4 className="font-semibold text-gray-900 text-xs sm:text-base truncate">
                              {conv.user.firstName}
                            </h4>
                            <span className="text-[10px] sm:text-xs text-gray-500 flex-shrink-0">
                              {formatLastMessageTime(
                                conv.lastMessage?.createdAt,
                              )}
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-sm text-gray-600 truncate">
                            {conv.lastMessage?.text || "No messages yet"}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                            {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <>
                  {/* Messages View - Optimized spacing */}
                  <div
                    ref={messagesBoxRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-50 space-y-2 sm:space-y-3"
                  >
                    {isLoadingMessages && messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-3 sm:p-4 text-center">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 mb-3 sm:mb-4 text-gray-300">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium text-sm sm:text-base">
                          No messages yet
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2 max-w-xs">
                          Start the conversation by sending a message to{" "}
                          {selectedChat?.user.firstName}
                        </p>
                      </div>
                    ) : (
                      <>
                        {hasMore && nextCursor && (
                          <div className="text-center py-1.5 sm:py-2">
                            <button
                              onClick={() =>
                                loadHistory(selectedChat._id, nextCursor)
                              }
                              className="text-[10px] sm:text-xs text-purple-600 hover:text-purple-800 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:border-purple-300 transition-colors"
                              disabled={isLoadingMessages}
                            >
                              {isLoadingMessages ? (
                                <span className="flex items-center gap-1.5 sm:gap-2">
                                  <div className="animate-spin rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 border-b-2 border-purple-600"></div>
                                  Loading...
                                </span>
                              ) : (
                                "Load earlier messages"
                              )}
                            </button>
                          </div>
                        )}

                        {messages.map((msg) => (
                          <div
                            key={msg._id || msg.id}
                            className={`flex ${
                              msg.senderRole === "admin"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] sm:max-w-[70%] rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-2 ${
                                msg.senderRole === "admin"
                                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
                                  : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                              }`}
                            >
                              {msg.text && (
                                <p className="text-xs sm:text-sm break-words">
                                  {msg.text}
                                </p>
                              )}

                              {/* File attachments */}
                              {msg.file && (
                                <div className="mt-1.5 sm:mt-2">
                                  {msg.file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                    <img
                                      src={`${BASE_URL}/${msg.file}`}
                                      alt="Attachment"
                                      className="max-w-full h-auto rounded-lg"
                                      style={{ maxWidth: "150px" }}
                                    />
                                  ) : (
                                    <a
                                      href={`${BASE_URL}/${msg.file}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm flex items-center gap-1"
                                    >
                                      <span>📎</span>
                                      <span>Download file</span>
                                    </a>
                                  )}
                                </div>
                              )}

                              <p
                                className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${
                                  msg.senderRole === "admin"
                                    ? "text-white/70"
                                    : "text-gray-500"
                                }`}
                              >
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping(selectedChat.user._id) && (
                          <div className="flex justify-start">
                            <div className="max-w-[70%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 bg-white text-gray-800 rounded-bl-none shadow-sm">
                              <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div ref={bottomRef} />
                      </>
                    )}
                  </div>

                  {/* Message Input - Compact on mobile */}
                  <div className="p-2 sm:p-4 bg-white border-t border-gray-200 flex-shrink-0">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex gap-1.5 sm:gap-2"
                    >
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          selectedChat
                            ? "Type a message..."
                            : "Select a conversation"
                        }
                        className="flex-1 px-3 sm:px-4 py-2 text-xs sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={!selectedChat}
                      />
                      <button
                        type="submit"
                        disabled={!selectedChat || !message.trim()}
                        className={`rounded-full p-2 sm:p-2.5 transition-all duration-200 active:scale-95 flex-shrink-0 ${
                          selectedChat && message.trim()
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <Send className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                      </button>
                    </form>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingChatWidget;
