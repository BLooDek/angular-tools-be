import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import authRouter from './auth/router/auth.js';
import tabsRouter from './tabs/router/tabs.js';
import notesRouter from './notes/router/notes.js';
import cookieParser from 'cookie-parser';
import mailRouter from './mail/routes/mail.js';
import cors from 'cors';
import swaggerDocument from './config/swagger_output.json' with { type: 'json' };
import { authorizeUser } from './auth/middleware/authorization.js';

export const port = process.env.APP_PORT || 3000;
const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:4200'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api', mailRouter);
app.use('/api', authorizeUser, tabsRouter);
app.use('/api', authorizeUser, notesRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server on port http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});

/*
npx prisma generate
npx prisma db push
*/
