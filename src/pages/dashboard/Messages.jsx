import { useState, useEffect } from "react";
import { Send, Search, MoreVertical, Plus, X } from "lucide-react";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mock chat list
  const [chats] = useState([
    {
      id: 1,
      name: "John Doe",
      lastMessage: "That sounds great!",
      timestamp: "2 mins",
      avatar: "JD",
      unread: 2,
      isActive: true,
    },
    {
      id: 2,
      name: "Sarah Williams",
      lastMessage: "Can you send me the details?",
      timestamp: "1 hour",
      avatar: "SW",
      unread: 0,
      isActive: false,
    },
    {
      id: 3,
      name: "Mike Johnson",
      lastMessage: "Perfect! See you tomorrow.",
      timestamp: "3 hours",
      avatar: "MJ",
      unread: 1,
      isActive: true,
    },
    {
      id: 4,
      name: "Emily Chen",
      lastMessage: "Thank you for your help!",
      timestamp: "Yesterday",
      avatar: "EC",
      unread: 0,
      isActive: false,
    },
    {
      id: 5,
      name: "Alex Brown",
      lastMessage: "Let's schedule a meeting",
      timestamp: "Yesterday",
      avatar: "AB",
      unread: 0,
      isActive: true,
    },
  ]);

  // Mock messages
  const [messagesData] = useState({
    1: [
      {
        id: 1,
        sender: "John Doe",
        text: "Hey, how are you?",
        timestamp: "10:30 AM",
        isMine: false,
      },
      {
        id: 2,
        sender: "You",
        text: "I'm doing great! How about you?",
        timestamp: "10:31 AM",
        isMine: true,
      },
      {
        id: 3,
        sender: "John Doe",
        text: "Doing well! Want to grab coffee?",
        timestamp: "10:32 AM",
        isMine: false,
      },
      {
        id: 4,
        sender: "You",
        text: "That sounds great!",
        timestamp: "10:33 AM",
        isMine: true,
      },
    ],
    2: [
      {
        id: 1,
        sender: "Sarah Williams",
        text: "Hi there!",
        timestamp: "Yesterday",
        isMine: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Hello! How can I help?",
        timestamp: "Yesterday",
        isMine: true,
      },
      {
        id: 3,
        sender: "Sarah Williams",
        text: "Can you send me the details?",
        timestamp: "1 hour",
        isMine: false,
      },
    ],
    3: [
      {
        id: 1,
        sender: "Mike Johnson",
        text: "Looking forward to meeting you",
        timestamp: "3 hours",
        isMine: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Me too! Same time?",
        timestamp: "3 hours",
        isMine: true,
      },
      {
        id: 3,
        sender: "Mike Johnson",
        text: "Perfect! See you tomorrow.",
        timestamp: "3 hours",
        isMine: false,
      },
    ],
  });

  const currentChat = selectedChat
    ? chats.find((c) => c.id === selectedChat)
    : null;
  const currentMessages = selectedChat ? messagesData[selectedChat] || [] : [];

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchInput.toLowerCase()),
  );

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      setMessageInput("");
      // API call would go here
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex gap-4 lg:gap-6">
      {/* Chat List - Show on mobile when no chat selected, show on desktop always */}
      {!selectedChat || isLargeScreen ? (
        <div className="w-full lg:w-80 bg-white rounded-xl border border-slate-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <Plus size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-sm"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat.id);
                }}
                className={`w-full p-3 lg:p-4 border-b border-slate-100 transition-all text-left hover:bg-slate-50 ${
                  selectedChat === chat.id
                    ? "bg-brand-50 border-l-4 border-l-brand-500"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-brand-500 to-brand-600 text-white rounded-full flex items-center justify-center font-semibold text-xs lg:text-sm shrink-0">
                      {chat.avatar}
                    </div>
                    {chat.isActive && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900 truncate text-sm lg:text-base">
                        {chat.name}
                      </p>
                      <p className="text-xs text-gray-500 shrink-0">
                        {chat.timestamp}
                      </p>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-brand-500 text-white text-xs rounded-full flex items-center justify-center font-bold shrink-0">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Chat Window - Show on mobile when chat selected, show on desktop always when chat selected */}
      {selectedChat ? (
        <div className="flex-1 bg-white rounded-xl border border-slate-100 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 lg:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSelectedChat(null)}
                className="lg:hidden p-1 hover:bg-slate-100 rounded-lg transition-all shrink-0"
              >
                <X size={20} className="text-slate-600" />
              </button>
              <div className="relative shrink-0">
                <div className="w-10 h-10 bg-linear-to-br from-brand-500 to-brand-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  {currentChat?.avatar}
                </div>
                {currentChat?.isActive && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm lg:text-base truncate">
                  {currentChat?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {currentChat?.isActive ? "Active now" : "Offline"}
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-all shrink-0">
              <MoreVertical size={20} className="text-slate-600" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-4 bg-slate-50">
            {currentMessages.length > 0 ? (
              currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      msg.isMine
                        ? "bg-brand-500 text-white rounded-br-none shadow-sm"
                        : "bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.isMine ? "text-brand-100" : "text-gray-400"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p className="text-sm">
                  No messages yet. Start the conversation!
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 lg:p-6 border-t border-slate-100 flex gap-2 lg:gap-3">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-sm"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all flex items-center gap-2 font-semibold shrink-0"
            >
              <Send size={18} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 bg-white rounded-xl border border-slate-100 items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 text-lg">
              Select a chat to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
