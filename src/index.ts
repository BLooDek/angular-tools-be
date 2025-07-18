import swaggerUi from 'swagger-ui-express';

import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import expressWs from 'express-ws';
import { fileURLToPath } from 'url';
import http from 'http';

import { authorizeUser } from './auth/middleware/authorization.middleware.js';
import swaggerDocument from './config/swagger_output.json' with { type: 'json' };
import todoRouter from './todo/router/todo.router.js';
import notesRouter from './notes/router/notes.router.js';
import authRouter from './auth/routers/auth.router.js';
import mailRouter from './mail/routes/mail.js';
import tabsRouter from './tabs/router/tabs.router.js';
import signalingRouter from './signaling/routers/signaling.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const port = process.env.APP_PORT || 3000;
const app = express();
const server = http.createServer(app);
const wsInstance = expressWs(app, server);
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:4200'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', authRouter);
// app.use('/api', mailRouter);
app.use('/api', authorizeUser, tabsRouter);
app.use('/api', authorizeUser, notesRouter);
app.use('/api', authorizeUser, todoRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/ws', signalingRouter(wsInstance));

server.listen(port, () => {
  console.log(`Server on port http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});

/*
npx prisma generate
npx prisma db push
*/
