import { WebSocket } from 'ws';
export interface ExtendedWebSocket extends WebSocket {
  name?: string;
}
