import express from 'express';
import { handleConnection } from '../controllers/signaling.controller.js';
import expressWs from 'express-ws';

export default (wsInstance: expressWs.Instance) => {
  const router = express.Router();

  wsInstance.applyTo(router);

  router.ws('/signaling', (ws, req) => {
    handleConnection(ws, wsInstance);
  });

  return router;
};
