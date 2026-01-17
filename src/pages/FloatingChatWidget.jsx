// import React, { useState } from "react";
// import { X, Send, Minimize2, User, Circle } from "lucide-react";

// const FloatingChatWidget = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [message, setMessage] = useState("");
//   const [unreadCount, setUnreadCount] = useState(3);

//   // Mock chat data
//   const [chats] = useState([
//     {
//       id: 1,
//       name: "Moulik Tiwari",
//       avatar: "M",
//       lastMessage: "Hi, I need help with my order",
//       time: "2m ago",
//       unread: 2,
//       online: true,
//       messages: [
//         {
//           id: 1,
//           sender: "user",
//           text: "Hi, I need help with my order",
//           time: "10:30 AM",
//         },
//         {
//           id: 2,
//           sender: "admin",
//           text: "Hello! I'd be happy to help. What's your order number?",
//           time: "10:31 AM",
//         },
//         { id: 3, sender: "user", text: "It's #24000", time: "10:32 AM" },
//       ],
//     },
//     {
//       id: 2,
//       name: "Priya Sharma",
//       avatar: "P",
//       lastMessage: "Thank you for your help!",
//       time: "15m ago",
//       unread: 0,
//       online: false,
//       messages: [
//         {
//           id: 1,
//           sender: "user",
//           text: "Is this product available in blue?",
//           time: "9:45 AM",
//         },
//         {
//           id: 2,
//           sender: "admin",
//           text: "Yes, we have it in blue color",
//           time: "9:46 AM",
//         },
//         {
//           id: 3,
//           sender: "user",
//           text: "Thank you for your help!",
//           time: "9:47 AM",
//         },
//       ],
//     },
//     {
//       id: 3,
//       name: "Rahul Kumar",
//       avatar: "R",
//       lastMessage: "When will my order be delivered?",
//       time: "1h ago",
//       unread: 1,
//       online: true,
//       messages: [
//         {
//           id: 1,
//           sender: "user",
//           text: "When will my order be delivered?",
//           time: "8:20 AM",
//         },
//       ],
//     },
//   ]);

//   const handleSendMessage = () => {
//     if (message.trim()) {
//       // WebSocket send logic here
//       console.log("Sending message:", message);
//       setMessage("");
//     }
//   };

//   const handleChatSelect = (chat) => {
//     setSelectedChat(chat);
//     setIsMinimized(false);
//   };

//   const handleBack = () => {
//     setSelectedChat(null);
//   };

//   return (
//     <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
//       {/* Floating Chat Button */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-3 sm:p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 group"
//         >
//           <svg
//             className="w-6 h-6 sm:w-7 sm:h-7"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
//             />
//           </svg>

//           {/* Unread Badge */}
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center animate-pulse">
//               {unreadCount}
//             </span>
//           )}

//           {/* Pulse Animation */}
//           <span className="absolute inset-0 rounded-full bg-purple-400 opacity-0 group-hover:opacity-30 group-hover:animate-ping"></span>
//         </button>
//       )}

//       {/* Chat Panel */}
//       {isOpen && (
//         <div
//           className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
//             isMinimized
//               ? "w-[calc(100vw-2rem)] sm:w-80 h-16"
//               : "w-[calc(100vw-2rem)] sm:w-96 h-[calc(100vh-2rem)] sm:h-[600px] max-h-[calc(100vh-2rem)]"
//           } flex flex-col overflow-hidden`}
//         >
//           {/* Header */}
//           <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
//             <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//               {selectedChat && (
//                 <button
//                   onClick={handleBack}
//                   className="hover:bg-white/20 rounded-full p-1 transition-colors flex-shrink-0"
//                 >
//                   <svg
//                     className="w-4 h-4 sm:w-5 sm:h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 19l-7-7 7-7"
//                     />
//                   </svg>
//                 </button>
//               )}
//               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
//                 💬
//               </div>
//               <div className="min-w-0 flex-1">
//                 <h3 className="font-bold text-sm sm:text-lg truncate">
//                   {selectedChat ? selectedChat.name : "Customer Messages"}
//                 </h3>
//                 <p className="text-xs text-white/80 truncate">
//                   {selectedChat
//                     ? selectedChat.online
//                       ? "Online"
//                       : "Offline"
//                     : `${unreadCount} unread`}
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-1 sm:gap-2 flex-shrink-0">
//               <button
//                 onClick={() => setIsMinimized(!isMinimized)}
//                 className="hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-colors"
//               >
//                 <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//               <button
//                 onClick={() => {
//                   setIsOpen(false);
//                   setSelectedChat(null);
//                   setIsMinimized(false);
//                 }}
//                 className="hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-colors"
//               >
//                 <X className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//             </div>
//           </div>

//           {!isMinimized && (
//             <>
//               {/* Chat List View */}
//               {!selectedChat ? (
//                 <div className="flex-1 overflow-y-auto">
//                   {chats.map((chat) => (
//                     <button
//                       key={chat.id}
//                       onClick={() => handleChatSelect(chat)}
//                       className="w-full p-3 sm:p-4 hover:bg-gray-50 transition-colors flex items-start gap-2 sm:gap-3 border-b border-gray-100"
//                     >
//                       <div className="relative flex-shrink-0">
//                         <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
//                           {chat.avatar}
//                         </div>
//                         {chat.online && (
//                           <Circle className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 fill-green-500 text-green-500" />
//                         )}
//                       </div>
//                       <div className="flex-1 text-left min-w-0">
//                         <div className="flex justify-between items-start mb-1 gap-2">
//                           <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
//                             {chat.name}
//                           </h4>
//                           <span className="text-xs text-gray-500 flex-shrink-0">
//                             {chat.time}
//                           </span>
//                         </div>
//                         <p className="text-xs sm:text-sm text-gray-600 truncate">
//                           {chat.lastMessage}
//                         </p>
//                       </div>
//                       {chat.unread > 0 && (
//                         <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
//                           {chat.unread}
//                         </span>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               ) : (
//                 <>
//                   {/* Messages View */}
//                   <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50 space-y-2 sm:space-y-3">
//                     {selectedChat.messages.map((msg) => (
//                       <div
//                         key={msg.id}
//                         className={`flex ${
//                           msg.sender === "admin"
//                             ? "justify-end"
//                             : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 ${
//                             msg.sender === "admin"
//                               ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
//                               : "bg-white text-gray-800 rounded-bl-none shadow-sm"
//                           }`}
//                         >
//                           <p className="text-xs sm:text-sm break-words">
//                             {msg.text}
//                           </p>
//                           <p
//                             className={`text-xs mt-1 ${
//                               msg.sender === "admin"
//                                 ? "text-white/70"
//                                 : "text-gray-500"
//                             }`}
//                           >
//                             {msg.time}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Message Input */}
//                   <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex-shrink-0">
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         onKeyPress={(e) =>
//                           e.key === "Enter" && handleSendMessage()
//                         }
//                         placeholder="Type a message..."
//                         className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                       />
//                       <button
//                         onClick={handleSendMessage}
//                         className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-2 sm:p-2.5 transition-all duration-200 active:scale-95 flex-shrink-0"
//                       >
//                         <Send className="w-4 h-4 sm:w-5 sm:h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FloatingChatWidget;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { X, Send, Minimize2, Circle } from "lucide-react";

const BASE_URL = "http://localhost:3000";

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
    if (
      messagesBoxRef.current &&
      messagesBoxRef.current.scrollTop === 0 &&
      hasMore &&
      nextCursor &&
      selectedChat &&
      !isLoadingMessages
    ) {
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

    // Add message to local state immediately
    const newMessage = {
      _id: Date.now().toString(), // Temporary ID
      text: message,
      senderRole: "admin",
      conversation: selectedChat._id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
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
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-3 sm:p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 group"
        >
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7"
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

          {/* Unread Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}

          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full bg-purple-400 opacity-0 group-hover:opacity-30 group-hover:animate-ping"></span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized
              ? "w-[calc(100vw-2rem)] sm:w-80 h-16"
              : "w-[calc(100vw-2rem)] sm:w-96 h-[calc(100vh-2rem)] sm:h-[600px] max-h-[calc(100vh-2rem)]"
          } flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                💬
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm sm:text-lg truncate">
                  {selectedChat
                    ? selectedChat.user.firstName
                    : "Customer Messages"}
                </h3>
                <p className="text-xs text-white/80 truncate">
                  {selectedChat
                    ? isOnline(selectedChat.user._id)
                      ? "Online"
                      : "Offline"
                    : `${unreadCount} unread`}
                </p>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-colors"
              >
                <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedChat(null);
                  setIsMinimized(false);
                  if (socket) socket.disconnect();
                }}
                className="hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat List View */}
              {!selectedChat ? (
                <div className="flex-1 overflow-y-auto">
                  {isLoadingConversations ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <div className="w-16 h-16 mb-4 text-gray-400">
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
                      <p className="text-gray-500 font-medium">
                        No conversations yet
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        When customers message you, they'll appear here
                      </p>
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <button
                        key={conv._id}
                        onClick={() => handleChatSelect(conv)}
                        className="w-full p-3 sm:p-4 hover:bg-gray-50 transition-colors flex items-start gap-2 sm:gap-3 border-b border-gray-100"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                            {getAvatar(conv.user.firstName)}
                          </div>
                          {isOnline(conv.user._id) && (
                            <Circle className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 fill-green-500 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {conv.user.firstName}
                            </h4>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatLastMessageTime(
                                conv.lastMessage?.createdAt,
                              )}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {conv.lastMessage?.text || "No messages yet"}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <>
                  {/* Messages View */}
                  <div
                    ref={messagesBoxRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50 space-y-2 sm:space-y-3"
                  >
                    {isLoadingMessages && messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <div className="w-20 h-20 mb-4 text-gray-300">
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
                        <p className="text-gray-500 font-medium">
                          No messages yet
                        </p>
                        <p className="text-gray-400 text-sm mt-2 max-w-xs">
                          Start the conversation by sending a message to{" "}
                          {selectedChat?.user.firstName}
                        </p>
                      </div>
                    ) : (
                      <>
                        {hasMore && nextCursor && (
                          <div className="text-center py-2">
                            <button
                              onClick={() =>
                                loadHistory(selectedChat._id, nextCursor)
                              }
                              className="text-xs text-purple-600 hover:text-purple-800 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:border-purple-300 transition-colors"
                              disabled={isLoadingMessages}
                            >
                              {isLoadingMessages ? (
                                <span className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
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
                              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 ${
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
                                <div className="mt-2">
                                  {msg.file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                    <img
                                      src={`${BASE_URL}/${msg.file}`}
                                      alt="Attachment"
                                      className="max-w-full h-auto rounded-lg"
                                      style={{ maxWidth: "200px" }}
                                    />
                                  ) : (
                                    <a
                                      href={`${BASE_URL}/${msg.file}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                    >
                                      <span>📎</span>
                                      <span>Download file</span>
                                    </a>
                                  )}
                                </div>
                              )}

                              <p
                                className={`text-xs mt-1 ${
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
                            <div className="max-w-[70%] rounded-2xl px-4 py-2 bg-white text-gray-800 rounded-bl-none shadow-sm">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div ref={bottomRef} />
                      </>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-3 sm:p-4 bg-white border-t border-gray-200 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          selectedChat
                            ? "Type a message..."
                            : "Select a conversation to message"
                        }
                        className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
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