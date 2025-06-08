import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import authRouter from './auth/router/auth.js';
import tabsRouter from './tabs/router/tabs.js';
import { authorizeUser } from './auth/middleware/authorization.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { swaggerSpec } from './config/swagger.config.js';

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
app.use('/api', tabsRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server on port http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});

/*
npx prisma generate
npx prisma db push
*/
