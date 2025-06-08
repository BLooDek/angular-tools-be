import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import authRouter from './auth/router/auth.js';
import { swaggerOptions } from './config/swagger.config.js';
import { authorizeUser } from './auth/middleware/authorization.js';
import cookieParser from 'cookie-parser';

export const port = process.env.APP_PORT || 3000;
const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(authRouter);

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', authorizeUser, (req, res) => {
  res.send('Welcome to the API');
});
app.listen(port, () => {
  console.log(`Server on port http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});

/*
npx prisma generate
npx prisma db push
*/
