import expressWs from 'express-ws';
import * as userManager from '../services/signaling.service.js';
import { WebSocket } from 'ws';
import { ExtendedWebSocket } from '../models/signaling.interface.js';

const sendTo = (connection: WebSocket, message: object) => {
  connection.send(JSON.stringify(message));
};

export const handleConnection = (
  ws: ExtendedWebSocket,
  wsInstance: expressWs.Instance,
) => {
  console.log('A new user connected.');

  ws.on('message', (message: string) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.error('Invalid JSON received:', e);
      return;
    }

    switch (data.type) {
      case 'login':
        handleLogin(ws as ExtendedWebSocket, data);
        break;

      case 'offer':
      case 'answer':
      case 'candidate':
        handleForwarding(ws as ExtendedWebSocket, data);
        break;

      case 'leave':
        handleLeave(ws as ExtendedWebSocket);
        break;

      default:
        sendTo(ws, {
          type: 'error',
          message: `Unrecognized message type: ${data.type}`,
        });
        break;
    }
  });

  ws.on('close', () => {
    console.log(`User ${(ws as ExtendedWebSocket).name} disconnected.`);
    userManager.removeUser(ws as ExtendedWebSocket);
  });
};

const handleLogin = (ws: ExtendedWebSocket, data: { name: any }) => {
  console.log(`User trying to log in as: ${data.name}`);
  const success = userManager.addUser(data.name, ws);
  sendTo(ws, { type: 'login', success });
  if (!success) {
    console.log(`Login failed for ${data.name}, username taken.`);
  }
};

const handleForwarding = (
  ws: ExtendedWebSocket,
  data: { type: string; target: any },
) => {
  console.log(`Forwarding '${data.type}' from ${ws.name} to ${data.target}`);
  if (data.type === 'offer') {
    userManager.linkPeers(ws.name, data.target);
  }
  userManager.forwardMessage(ws.name, data);
};

const handleLeave = (ws: ExtendedWebSocket) => {
  console.log(`User ${ws.name} is leaving the call.`);
  userManager.removeUser(ws);
};
