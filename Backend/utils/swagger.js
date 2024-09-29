import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Course Notes API',
    version: '1.0.0',
    description: 'API documentation for managing course notes with PDF uploads',
  },
  servers: [
    {
      url: 'http://localhost:5000', // Replace with your base URL
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./swagger/*.js'], // Point to your swagger docs files
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Setup the Swagger UI
export default function setupSwaggerDocs(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at http://localhost:5000/api-docs');
}
