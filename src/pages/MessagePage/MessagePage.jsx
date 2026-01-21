import { useState } from "react";
import { IoIosSend } from "react-icons/io";
const messagesData = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Seller",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    lastMessage: "Hi Admin",
    time: "2025-01-10 10:20am",
    isActive: true,
  },
  {
    id: 2,
    name: "Doe Johnson",
    role: "Buyer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    lastMessage: "How Can I Help You",
    time: "2025-01-10 10:20am",
    isActive: false,
  },
  // Add more contacts here...
];

const chatMessages = [
  {
    id: 1,
    text: "Hi Admin",
    sender: "them",
    time: "2025-01-10 10:20am",
  },
  {
    id: 2,
    text: "How Can I Help You",
    sender: "me",
    time: "2025-01-10 10:20am",
  },
];

const MessagePage = () => {
  const [selectedContact, setSelectedContact] = useState(messagesData[0]);

  return (
    <div className="min-h-[99%] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-semibold text-gray-800">Messages</h1>
        <div className="flex items-center gap-3">
          <img
            src={selectedContact.avatar}
            alt={selectedContact.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100"
          />
          <div>
            <p className="font-medium text-gray-900">{selectedContact.name}</p>
            <p className="text-xs text-gray-500">{selectedContact.role}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Contact List */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A435C]"
            />
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {messagesData.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedContact.id === contact.id
                    ? "bg-indigo-50 border-l-4 border-[#1A435C]"
                    : ""
                }`}
              >
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium text-gray-900 truncate">
                      {contact.name}
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {contact.time.split(" ")[0]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {contact.role}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {contact.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender === "me"
                      ? "bg-[#1A435C] text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70 text-right">
                    {msg.time.split(" ")[1]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type here..."
                className="flex-1 px-5 py-3 bg-gray-100 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1A435C]"
              />
              <button className="p-2 cursor-pointer bg-[#1A435C] text-white rounded-full hover:bg-[#1A435C] transition-colors">
                <IoIosSend size={25} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;
