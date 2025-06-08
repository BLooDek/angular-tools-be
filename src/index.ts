import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './config/swagger.config.js';
import { PrismaClient } from './generated/prisma/client.js';

export const port = process.env.APP_PORT || 3000;
const app = express();
const prisma = new PrismaClient();
app.use(helmet());
app.use(express.json());

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.post('/users', async (req, res) => {
  try {
    const { email, name } = req.body;
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    res.status(201).json(newUser);
  } catch (error: { message: string } | any) {
    res
      .status(500)
      .json({ error: 'Could not create user', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server on port http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});

/*
npx prisma generate
*/
