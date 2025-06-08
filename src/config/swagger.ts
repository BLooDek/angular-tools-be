import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'Angular Tools API',
    description: 'API documentation for the Angular Tools application.',
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    { name: 'Auth', description: 'Authentication related endpoints' },
    { name: 'Tabs', description: 'Tab management endpoints' },
  ],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your bearer token in the format **Bearer <token>**',
      },
    },

    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Login: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'test@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123',
          },
        },
        required: ['email', 'password'],
      },
      Register: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
        required: ['email', 'password'],
      },
      Tab: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          userId: { type: 'string', format: 'uuid' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['name', 'userId'],
      },
    },
  },
};

const outputFile = './src/config/swagger_output.json';
const endpointsFiles = [
  './src/index.ts',
  './src/auth/router/auth.ts',
  './src/tabs/router/tabs.ts',
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(
  () => {
    console.log('Swagger documentation generated successfully.');
  },
);
