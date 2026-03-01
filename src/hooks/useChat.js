import { useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import socketService from "@/lib/utils/socketService";
import {
  setConnected,
  setAuthenticated,
  setLoadingUsers,
  setChatUsers,
  setActiveRoom,
  clearActiveRoom,
  setLoadingMessages,
  setMessages,
  addMessage,
  setSending,
  updateUserStatus,
  clearUnreadCount,
  setError,
  resetChat,
} from "@/store/slices/chatSlice";

const MESSAGES_PER_PAGE = 10;

export function useChat() {
  const dispatch = useDispatch();
  const {
    chatUsers,
    activeRoomId,
    activeReceiverId,
    messages,
    isConnected,
    isAuthenticated,
    isLoadingUsers,
    isLoadingMessages,
    isSending,
    hasMoreMessages,
    currentPage,
    onlineUsers,
    error,
  } = useSelector((state) => state.chat);

  const { user } = useSelector((state) => state.auth);
  const listenersSetupRef = useRef(false);
  const authenticatedRef = useRef(false);

  // ── Fetch Chat Users ────────────────────────────────────────────────────

  const fetchChatUsers = useCallback(() => {
    dispatch(setLoadingUsers(true));
    socketService.getChatUsers((response) => {
      const users = Array.isArray(response) ? response : [];
      dispatch(setChatUsers(users));
    });
  }, [dispatch]);

  // ── Initialize Connection ───────────────────────────────────────────────

  const initializeChat = useCallback(() => {
    if (!user) return;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) return;

    const socket = socketService.connect();

    if (!listenersSetupRef.current) {
      socketService.onConnect(() => {
        dispatch(setConnected(true));
        dispatch(setError(null));

        if (!authenticatedRef.current) {
          socketService.authenticate({ token }, (response) => {
            if (response?.status === true) {
              authenticatedRef.current = true;
              dispatch(setAuthenticated(true));
              fetchChatUsers();
            } else {
              dispatch(setError(response?.message || "Authentication failed"));
            }
          });
        }
      });

      socketService.onDisconnect(() => {
        dispatch(setConnected(false));
        authenticatedRef.current = false;
      });

      socketService.onConnectError((err) => {
        const errorMsg =
          typeof err === "string" ? err : err?.message || "Connection failed";
        dispatch(setError(errorMsg));
        dispatch(setConnected(false));
      });

      socketService.onReceiveMessage((data) => {
        if (data?.message) {
          dispatch(addMessage(data.message));
        }
      });

      socketService.onUserStatus((status) => {
        dispatch(updateUserStatus(status));
      });

      listenersSetupRef.current = true;
    }

    if (socket.connected && !authenticatedRef.current) {
      socketService.authenticate({ token }, (response) => {
        if (response?.status === true) {
          authenticatedRef.current = true;
          dispatch(setAuthenticated(true));
          fetchChatUsers();
        } else {
          dispatch(setError(response?.message || "Authentication failed"));
        }
      });
    }
  }, [user, dispatch, fetchChatUsers]);

  // ── Join Room ───────────────────────────────────────────────────────────

  const joinRoom = useCallback(
    (receiverId, roomId) => {
      dispatch(setActiveRoom({ roomId, receiverId }));
      dispatch(clearUnreadCount(roomId));
      dispatch(setLoadingMessages(true));

      socketService.joinRoom({ receiverId });

      const timeoutId = setTimeout(() => {
        dispatch(setLoadingMessages(false));
      }, 10000);

      socketService.getMessages(
        { roomId, page: 1, limit: MESSAGES_PER_PAGE },
        (response) => {
          clearTimeout(timeoutId);
          if (response?.messages) {
            const msgs = Array.isArray(response.messages)
              ? response.messages
              : [];
            const hasMore = response.meta
              ? response.meta.page < response.meta.totalPage
              : msgs.length === MESSAGES_PER_PAGE;
            dispatch(setMessages({ messages: msgs, page: 1, hasMore }));
          } else {
            dispatch(setMessages({ messages: [], page: 1, hasMore: false }));
          }
        },
      );
    },
    [dispatch],
  );

  // ── Create and Join Room (when no existing room) ────────────────────────

  const createAndJoinRoom = useCallback(
    (receiverId) => {
      return new Promise((resolve) => {
        dispatch(setLoadingMessages(true));

        socketService.joinRoom({ receiverId }, (response) => {
          if (response?.chatRoom?.id) {
            const roomId = response.chatRoom.id;

            dispatch(setActiveRoom({ roomId, receiverId }));

            socketService.getMessages(
              { roomId, page: 1, limit: MESSAGES_PER_PAGE },
              (msgResponse) => {
                if (msgResponse?.messages) {
                  const msgs = Array.isArray(msgResponse.messages)
                    ? msgResponse.messages
                    : [];
                  const hasMore = msgResponse.meta
                    ? msgResponse.meta.page < msgResponse.meta.totalPage
                    : msgs.length === MESSAGES_PER_PAGE;
                  dispatch(setMessages({ messages: msgs, page: 1, hasMore }));
                } else {
                  dispatch(
                    setMessages({
                      messages: [],
                      page: 1,
                      hasMore: false,
                    }),
                  );
                }
              },
            );

            fetchChatUsers();
            resolve(response);
          } else {
            dispatch(setLoadingMessages(false));
            resolve(null);
          }
        });
      });
    },
    [dispatch, fetchChatUsers],
  );

  // ── Load More Messages ──────────────────────────────────────────────────

  const loadMoreMessages = useCallback(() => {
    if (!activeRoomId || isLoadingMessages || !hasMoreMessages) return;

    const nextPage = currentPage + 1;
    dispatch(setLoadingMessages(true));

    const timeoutId = setTimeout(() => {
      dispatch(setLoadingMessages(false));
    }, 10000);

    socketService.getMessages(
      { roomId: activeRoomId, page: nextPage, limit: MESSAGES_PER_PAGE },
      (response) => {
        clearTimeout(timeoutId);
        if (response?.messages) {
          const msgs = Array.isArray(response.messages)
            ? response.messages
            : [];
          const hasMore = response.meta
            ? response.meta.page < response.meta.totalPage
            : msgs.length === MESSAGES_PER_PAGE;
          dispatch(setMessages({ messages: msgs, page: nextPage, hasMore }));
        } else {
          dispatch(setLoadingMessages(false));
        }
      },
    );
  }, [activeRoomId, isLoadingMessages, hasMoreMessages, currentPage, dispatch]);

  // ── Send Message ────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    (text, images) => {
      if (!activeRoomId) return;
      if (!text?.trim() && (!images || images.length === 0)) return;

      dispatch(setSending(true));

      const payload = {
        chatRoomId: activeRoomId,
      };
      if (text?.trim()) {
        payload.message = text.trim();
      }
      if (images && images.length > 0) {
        payload.images = images;
      }

      socketService.sendMessage(payload);

      setTimeout(() => {
        dispatch(setSending(false));
      }, 500);
    },
    [activeRoomId, dispatch],
  );

  // ── Leave Room ──────────────────────────────────────────────────────────

  const leaveRoom = useCallback(() => {
    dispatch(clearActiveRoom());
  }, [dispatch]);

  // ── Cleanup ─────────────────────────────────────────────────────────────

  const disconnectChat = useCallback(() => {
    socketService.disconnect();
    listenersSetupRef.current = false;
    authenticatedRef.current = false;
    dispatch(resetChat());
  }, [dispatch]);

  // ── Auto-initialize on mount ────────────────────────────────────────────

  useEffect(() => {
    if (user && !isConnected && !listenersSetupRef.current) {
      initializeChat();
    }
  }, [user, isConnected, initializeChat]);

  // ── Helpers ─────────────────────────────────────────────────────────────

  const currentUserId = user?.id || "";

  const isUserOnline = useCallback(
    (userId) => !!onlineUsers[userId],
    [onlineUsers],
  );

  return {
    chatUsers,
    activeRoomId,
    activeReceiverId,
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
    fetchChatUsers,
    joinRoom,
    createAndJoinRoom,
    loadMoreMessages,
    sendMessage,
    leaveRoom,
    disconnectChat,
    isUserOnline,
  };
}
