import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { MessageCircle, X, Send, Paperclip, Minimize2, Image, File, Loader2 } from "lucide-react";

const BASE_URL = "https://api.houseofresha.com";

export default function FloatingChatWidget() {
  const adminId = "69427846821bab385d46d2ce";
  const role = "admin";

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [msgInput, setMsgInput] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);
  
  // File upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const messagesBoxRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Recalculate unread count whenever conversations change
  useEffect(() => {
    const unread = conversations.reduce(
      (sum, conv) => sum + (conv.unreadCount || 0),
      0
    );
    setTotalUnread(unread);
  }, [conversations]);

  /* -------------------- SOCKET -------------------- */
  const socket = useMemo(() => {
    if (!activeConversation) return null;

    return io(BASE_URL, {
      auth: {
        userId: adminId,
        role,
        toUser: activeConversation.user._id,
      },
    });
  }, [activeConversation]);

  /* -------------------- FETCH CONVERSATIONS -------------------- */
  useEffect(() => {
    const fetchConversations = () => {
      fetch(`${BASE_URL}/conversations`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setConversations(data.conversations);
          }
        })
        .catch((err) => console.error("Failed to fetch conversations:", err));
    };

    fetchConversations();
    
    // Refresh conversations every 10 seconds to update unread counts
    const interval = setInterval(fetchConversations, 10000);
    
    return () => clearInterval(interval);
  }, []);

  /* -------------------- FETCH HISTORY -------------------- */
  const loadHistory = async (conversationId, before = null) => {
    let url = `${BASE_URL}/history?conversationId=${conversationId}`;
    if (before) url += `&before=${before}`;

    try {
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
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  /* -------------------- SELECT CONVERSATION -------------------- */
  const handleSelectConversation = async (conv) => {
    setActiveConversation(conv);
    setMessages([]);
    setNextCursor(null);
    setHasMore(true);
    await loadHistory(conv._id);
    
    // Reset file states when switching conversations
    setSelectedFile(null);
    setFilePreview(null);
    setUploadError(null);
    
    // Mark conversation as read
    setConversations((prev) =>
      prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
    );
  };

  /* -------------------- FILE HANDLING -------------------- */
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadError("File size too large. Maximum size is 10MB.");
      return;
    }

    setSelectedFile(file);
    setUploadError(null);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    // Reset file input
    event.target.value = "";
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setUploadError(null);
  };

  const uploadFile = async () => {
    if (!selectedFile || !activeConversation) {
      setUploadError("No file selected or no active conversation");
      return null;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("toUser", activeConversation.user._id);

    try {
      const response = await fetch(`${BASE_URL}/upload-file`, {
        method: "POST",
        body: formData,
        // Note: Don't set Content-Type header for FormData, browser sets it automatically
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      if (data.success) {
        return data.filePath; // Return the file path for the socket message
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload file. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  /* -------------------- SEND MESSAGE -------------------- */
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    
    if ((!msgInput.trim() && !selectedFile) || !socket || !activeConversation) {
      setUploadError("Please enter a message or select a file");
      return;
    }

    // If there's a selected file, upload it first
    if (selectedFile) {
      const filePath = await uploadFile();
      if (!filePath) {
        // Upload failed, error already set by uploadFile function
        return;
      }

      // Send the file message via socket
      socket.emit("send-message", {
        text: msgInput.trim() || "",
        toUser: activeConversation.user._id,
        file: filePath,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size
      });

      // Clear file states
      setSelectedFile(null);
      setFilePreview(null);
      setMsgInput("");
    } else {
      // Send text-only message
      socket.emit("send-message", {
        text: msgInput,
        toUser: activeConversation.user._id,
      });

      setMsgInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* -------------------- SOCKET EVENTS -------------------- */
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => console.log("Connected"));

    socket.on("new-message", (msg) => {
      const isActive =
        activeConversation && msg.conversation === activeConversation._id;

      // Show message only if active conversation
      if (isActive) {
        setMessages((prev) => [...prev, msg]);
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c._id === msg.conversation) {
            return {
              ...c,
              lastMessage: msg,
              unreadCount: isActive ? 0 : (c.unreadCount || 0) + 1,
            };
          }
          return c;
        })
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

    socket.on("typing", ({ from, isTyping, conversationId }) => {
      if (!activeConversation || conversationId !== activeConversation._id)
        return;

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

    // Listen for send-message errors
    socket.on("send-message-error", (error) => {
      setUploadError(error.message || "Failed to send message");
    });

    return () => socket.disconnect();
  }, [socket, activeConversation]);

  /* -------------------- INFINITE SCROLL -------------------- */
  const handleScroll = () => {
    if (
      messagesBoxRef.current?.scrollTop === 0 &&
      hasMore &&
      nextCursor &&
      activeConversation
    ) {
      loadHistory(activeConversation._id, nextCursor);
    }
  };

  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  /* -------------------- HELPERS -------------------- */
  const isOnline = (uid) => onlineUsers.has(String(uid));
  const isTyping = (uid) => typingUsers[String(uid)];
  
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith("image/")) return <Image size={16} />;
    if (fileType?.includes("pdf")) return <File size={16} />;
    if (fileType?.includes("word") || fileType?.includes("document")) return <File size={16} />;
    return <File size={16} />;
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 z-50"
        >
          <MessageCircle size={28} />
          {totalUnread > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 ${
            isMinimized ? "h-16 w-80" : "h-[600px] w-96"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={24} />
              <h3 className="font-semibold">
                {activeConversation
                  ? activeConversation.user.firstName
                  : "Messages"}
              </h3>
              {activeConversation && isOnline(activeConversation.user._id) && (
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeConversation && (
                <button
                  onClick={() => {
                    setActiveConversation(null);
                    setSelectedFile(null);
                    setFilePreview(null);
                    setUploadError(null);
                  }}
                  className="hover:bg-blue-800 p-1 rounded transition"
                >
                  <svg
                    className="w-5 h-5"
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
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-blue-800 p-1 rounded transition"
              >
                <Minimize2 size={20} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-800 p-1 rounded transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <>
              {!activeConversation ? (
                /* Conversations List */
                <div className="flex-1 overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No conversations yet
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <div
                        key={conv._id}
                        onClick={() => handleSelectConversation(conv)}
                        className="p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {conv.user.firstName?.charAt(0).toUpperCase()}
                              </div>
                              {isOnline(conv.user._id) && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900">
                                {conv.user.firstName}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {conv.lastMessage?.file ? (
                                  <span className="flex items-center gap-1">
                                    <Paperclip size={12} />
                                    {conv.lastMessage.fileName || "File"}
                                  </span>
                                ) : (
                                  conv.lastMessage?.text || "No messages"
                                )}
                              </div>
                            </div>
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 px-2 flex items-center justify-center ml-2">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* Chat View */
                <>
                  {/* Typing Indicator */}
                  {isTyping(activeConversation.user._id) && (
                    <div className="px-4 py-2 bg-blue-50 text-sm text-blue-600">
                      {activeConversation.user.firstName} is typing
                      <span className="typing-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    </div>
                  )}

                  {/* Messages */}
                  <div
                    ref={messagesBoxRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3"
                  >
                    {messages.map((msg) => {
                      const isAdmin = msg.senderRole === "admin";
                      const isImage = msg.fileType?.startsWith("image/") || 
                                     (msg.file && /\.(jpg|jpeg|png|gif|webp)$/i.test(msg.file));
                      const isFile = msg.file && !isImage;

                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                              isAdmin
                                ? "bg-blue-600 text-white rounded-br-sm"
                                : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                            }`}
                          >
                            {msg.text && <div className="break-words mb-1">{msg.text}</div>}
                            
                            {/* File Display */}
                            {msg.file && (
                              <div className="mt-1">
                                {isImage ? (
                                  <div className="space-y-1">
                                    <img
                                      src={`${BASE_URL}/${msg.file}`}
                                      alt={msg.fileName || "Image"}
                                      className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                                    />
                                    {msg.fileName && (
                                      <div className="text-xs opacity-90 truncate">
                                        {msg.fileName}
                                      </div>
                                    )}
                                  </div>
                                ) : isFile ? (
                                  <a
                                    href={`${BASE_URL}/${msg.file}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                                      isAdmin 
                                        ? "bg-blue-700 border-blue-800 hover:bg-blue-800" 
                                        : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                                    } transition-colors`}
                                  >
                                    <div className="flex-shrink-0">
                                      {getFileIcon(msg.fileType)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium truncate">
                                        {msg.fileName || "Download file"}
                                      </div>
                                      {msg.fileSize && (
                                        <div className="text-xs opacity-75">
                                          {formatFileSize(msg.fileSize)}
                                        </div>
                                      )}
                                    </div>
                                    <Paperclip size={16} className="flex-shrink-0" />
                                  </a>
                                ) : null}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>

                  {/* Error Message */}
                  {uploadError && (
                    <div className="px-4 py-2 bg-red-50 text-red-600 text-sm border-t border-red-100">
                      {uploadError}
                      <button
                        onClick={() => setUploadError(null)}
                        className="float-right text-red-400 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* File Preview Section */}
                  {selectedFile && (
                    <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {filePreview ? (
                            <div className="flex items-center gap-3">
                              <img
                                src={filePreview}
                                alt="Preview"
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <div className="text-sm font-medium truncate max-w-[150px]">
                                  {selectedFile.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatFileSize(selectedFile.size)}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                                {getFileIcon(selectedFile.type)}
                              </div>
                              <div>
                                <div className="text-sm font-medium truncate max-w-[150px]">
                                  {selectedFile.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatFileSize(selectedFile.size)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={removeSelectedFile}
                          disabled={isUploading}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
                    <div className="flex items-center gap-2">
                      {/* File Attachment Button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Attach file"
                      >
                        <Paperclip size={20} />
                      </button>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.zip"
                      />
                      
                      <input
                        type="text"
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={selectedFile ? "Add a caption (optional)..." : "Type a message..."}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isUploading}
                      />
                      
                      <button
                        onClick={handleSend}
                        disabled={(!msgInput.trim() && !selectedFile) || isUploading || !socket}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full p-2 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                        title="Send message"
                      >
                        {isUploading ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Send size={20} />
                        )}
                      </button>
                    </div>
                    
                    {/* File type hint */}
                    <div className="text-xs text-gray-400 mt-2 text-center">
                      Supports images, documents, and files (Max 10MB)
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        .typing-dots span {
          animation: blink 1.4s infinite;
          animation-fill-mode: both;
        }
        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%,
          80%,
          100% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}