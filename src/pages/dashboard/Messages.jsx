import { useState, useCallback, useMemo, useEffect } from "react";
import { MessageSquare, WifiOff, RefreshCw } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";

const Messages = () => {
  const {
    chatUsers,
    activeRoomId,
    messages,
    isConnected,
    isAuthenticated,
    isLoadingUsers,
    isLoadingMessages,
    isSending,
    hasMoreMessages,
    currentUserId,
    error,
    initializeChat,
    joinRoom,
    loadMoreMessages,
    sendMessage,
    leaveRoom,
    isUserOnline,
  } = useChat();

  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const handleSelectUser = useCallback(
    (chatUser) => {
      setSelectedUser(chatUser);
      setShowChat(true);
      joinRoom(chatUser.user.id, chatUser.roomId);
    },
    [joinRoom],
  );

  const handleBack = useCallback(() => {
    setShowChat(false);
    leaveRoom();
  }, [leaveRoom]);

  // Keep selectedUser in sync with chatUsers list
  useEffect(() => {
    if (!selectedUser || !chatUsers.length) return;
    const updatedUser = chatUsers.find(
      (u) =>
        u.user.id === selectedUser.user.id || u.roomId === selectedUser.roomId,
    );
    if (updatedUser && updatedUser.user.name !== selectedUser.user.name) {
      setSelectedUser(updatedUser);
    }
  }, [chatUsers, selectedUser]);

  const handleSendMessage = useCallback(
    (text, images) => {
      sendMessage(text, images);
    },
    [sendMessage],
  );

  const activeUser = useMemo(() => {
    if (selectedUser) return selectedUser;
    return null;
  }, [selectedUser]);

  // Connection error state
  if (error && !isConnected) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-slate-100 bg-white p-8 text-center">
          <div className="rounded-full bg-red-50 p-4">
            <WifiOff className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700">
              Connection Error
            </h3>
            <p className="mt-1 max-w-xs text-xs text-slate-500">{error}</p>
          </div>
          <button
            onClick={initializeChat}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:bg-brand-600"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Connecting state
  if (!isAuthenticated && !error) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-100 bg-white p-8">
          <div className="animate-pulse rounded-full bg-brand-50 p-4">
            <MessageSquare className="h-8 w-8 text-brand-400" />
          </div>
          <p className="text-sm text-slate-500">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-0 overflow-hidden rounded-xl border border-slate-100 bg-white">
      {/* Sidebar */}
      <aside
        className={`h-full w-full shrink-0 border-r border-slate-100 bg-white lg:w-80 ${
          showChat ? "hidden lg:block" : "block"
        }`}
      >
        <ChatSidebar
          chatUsers={chatUsers}
          activeRoomId={activeRoomId}
          isLoading={isLoadingUsers}
          onSelectUser={handleSelectUser}
          isUserOnline={isUserOnline}
        />
      </aside>

      {/* Chat Area */}
      <main
        className={`flex h-full flex-1 flex-col ${
          showChat ? "flex" : "hidden lg:flex"
        }`}
      >
        <ChatArea
          activeUser={activeUser}
          messages={messages}
          currentUserId={currentUserId}
          isLoadingMessages={isLoadingMessages}
          isSending={isSending}
          hasMoreMessages={hasMoreMessages}
          isUserOnline={isUserOnline}
          onSendMessage={handleSendMessage}
          onLoadMore={loadMoreMessages}
          onBack={handleBack}
        />
      </main>
    </div>
  );
};

export default Messages;
