import React, { useState } from 'react';
import { X, Send, Minimize2, User, Circle } from 'lucide-react';

const FloatingChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(3);

  // Mock chat data
  const [chats] = useState([
    {
      id: 1,
      name: 'Moulik Tiwari',
      avatar: 'M',
      lastMessage: 'Hi, I need help with my order',
      time: '2m ago',
      unread: 2,
      online: true,
      messages: [
        { id: 1, sender: 'user', text: 'Hi, I need help with my order', time: '10:30 AM' },
        { id: 2, sender: 'admin', text: 'Hello! I\'d be happy to help. What\'s your order number?', time: '10:31 AM' },
        { id: 3, sender: 'user', text: 'It\'s #24000', time: '10:32 AM' }
      ]
    },
    {
      id: 2,
      name: 'Priya Sharma',
      avatar: 'P',
      lastMessage: 'Thank you for your help!',
      time: '15m ago',
      unread: 0,
      online: false,
      messages: [
        { id: 1, sender: 'user', text: 'Is this product available in blue?', time: '9:45 AM' },
        { id: 2, sender: 'admin', text: 'Yes, we have it in blue color', time: '9:46 AM' },
        { id: 3, sender: 'user', text: 'Thank you for your help!', time: '9:47 AM' }
      ]
    },
    {
      id: 3,
      name: 'Rahul Kumar',
      avatar: 'R',
      lastMessage: 'When will my order be delivered?',
      time: '1h ago',
      unread: 1,
      online: true,
      messages: [
        { id: 1, sender: 'user', text: 'When will my order be delivered?', time: '8:20 AM' }
      ]
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // WebSocket send logic here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setIsMinimized(false);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 group"
        >
          <svg
            className="w-7 h-7"
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
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
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
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          } flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedChat && (
                <button
                  onClick={handleBack}
                  className="hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                💬
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {selectedChat ? selectedChat.name : 'Customer Messages'}
                </h3>
                <p className="text-xs text-white/80">
                  {selectedChat ? (selectedChat.online ? 'Online' : 'Offline') : `${unreadCount} unread`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedChat(null);
                  setIsMinimized(false);
                }}
                className="hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat List View */}
              {!selectedChat ? (
                <div className="flex-1 overflow-y-auto">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleChatSelect(chat)}
                      className="w-full p-4 hover:bg-gray-50 transition-colors flex items-start gap-3 border-b border-gray-100"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {chat.avatar}
                        </div>
                        {chat.online && (
                          <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-500 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-gray-900">{chat.name}</h4>
                          <span className="text-xs text-gray-500">{chat.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  {/* Messages View */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
                    {selectedChat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            msg.sender === 'admin'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                              : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender === 'admin' ? 'text-white/70' : 'text-gray-500'
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-2.5 transition-all duration-200 active:scale-95"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
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