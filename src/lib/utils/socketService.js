import { io } from "socket.io-client";

// ─── Configuration ──────────────────────────────────────────────────────────

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "https://relo-ecommerce-backend.vercel.app";

// ─── Event Names ────────────────────────────────────────────────────────────

export const SOCKET_EVENTS = {
  // Emit & listen (server responds on the same event name)
  AUTHENTICATE: "authenticate",
  JOIN_ROOM: "joinRoom",
  SEND_MESSAGE: "sendMessage",
  GET_MESSAGES: "getMessages",
  GET_CHAT_USERS: "getChatUsers",

  // Listen-only events
  RECEIVE_MESSAGE: "receiveMessage",
  USER_STATUS: "userStatus",

  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
};

// ─── Singleton Socket Service ───────────────────────────────────────────────

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnecting = false;
  }

  // ── Connection ──────────────────────────────────────────────────────────

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.isConnecting && this.socket) {
      return this.socket;
    }

    this.isConnecting = true;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      this.isConnecting = false;
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      this.isConnecting = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  getSocket() {
    return this.socket;
  }

  get connected() {
    return this.socket?.connected ?? false;
  }

  // ── Connection Event Listeners ──────────────────────────────────────────

  onConnect(callback) {
    this.socket?.on(SOCKET_EVENTS.CONNECT, callback);
  }

  onDisconnect(callback) {
    this.socket?.on(SOCKET_EVENTS.DISCONNECT, callback);
  }

  onConnectError(callback) {
    this.socket?.on(SOCKET_EVENTS.CONNECT_ERROR, callback);
  }

  // ── Persistent Event Listeners (incoming data) ─────────────────────────

  onReceiveMessage(callback) {
    this.socket?.on(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
  }

  offReceiveMessage() {
    this.socket?.off(SOCKET_EVENTS.RECEIVE_MESSAGE);
  }

  onUserStatus(callback) {
    this.socket?.on(SOCKET_EVENTS.USER_STATUS, callback);
  }

  offUserStatus() {
    this.socket?.off(SOCKET_EVENTS.USER_STATUS);
  }

  // ── Emit + Listen on same event (one-time response) ─────────────────────

  authenticate(payload, callback) {
    if (!this.socket) return;
    this.socket.once(SOCKET_EVENTS.AUTHENTICATE, callback);
    this.socket.emit(SOCKET_EVENTS.AUTHENTICATE, payload);
  }

  joinRoom(payload, callback) {
    if (!this.socket) return;
    if (callback) {
      this.socket.once(SOCKET_EVENTS.JOIN_ROOM, callback);
    }
    this.socket.emit(SOCKET_EVENTS.JOIN_ROOM, payload);
  }

  sendMessage(payload) {
    this.socket?.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);
  }

  getMessages(payload, callback) {
    if (!this.socket) return;
    this.socket.once(SOCKET_EVENTS.GET_MESSAGES, callback);
    this.socket.emit(SOCKET_EVENTS.GET_MESSAGES, payload);
  }

  getChatUsers(callback) {
    if (!this.socket) return;
    this.socket.once(SOCKET_EVENTS.GET_CHAT_USERS, callback);
    this.socket.emit(SOCKET_EVENTS.GET_CHAT_USERS, {});
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
