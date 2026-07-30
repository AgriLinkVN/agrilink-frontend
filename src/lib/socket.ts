import { io, Socket } from 'socket.io-client';
import { getApiUrl } from '@/config/runtime-config';

let socket: Socket | null = null;
let currentToken: string | null = null;

function getNamespaceUrl(): string {
  return `${getApiUrl()}/notifications`;
}

/**
 * Connect (or reuse) the singleton socket for the `/notifications` namespace.
 * If the token has changed since last connect (e.g. refresh), the existing
 * socket is torn down and reopened with the new token.
 */
export function connectSocket(token: string): Socket {
  if (socket && currentToken === token) return socket;

  // Token changed → reconnect cleanly
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  currentToken = token;
  socket = io(getNamespaceUrl(), {
    auth: { token },
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: 10,
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
  currentToken = null;
}

export function getSocket(): Socket | null {
  return socket;
}
