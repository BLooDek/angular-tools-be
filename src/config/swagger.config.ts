export const port = process.env.APP_PORT || 3000;
export const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Angular Tools API',
      version: '1.0.0',
      description: 'API documentation for Angular Tools project',
    },
    servers: [`http://localhost:${port}`],
  },
  apis: ['./src/index.ts'], // Path to the API docs
};
