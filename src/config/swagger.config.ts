import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  // `definition` contains the entire OpenAPI specification
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Angular Tools API',
      version: '1.0.0',
    },
    // CORRECT: The 'components' block must be inside 'definition'
    components: {
      schemas: {
        tab: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              description: 'The title of the tab',
            },
            // Note: I saw a 'type' property inside your schema's properties.
            // This is valid, but can sometimes be confusing. It's correctly placed.
            type: {
              type: 'string',
              description: 'The type of the tab (e.g., document, spreadsheet)',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
          },
          required: ['id', 'title', 'type', 'userId'],
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/index.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
