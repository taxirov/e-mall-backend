import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "E‑Mall API",
      version: "1.0.0",
      description: "E‑Mall backend OpenAPI documentation",
    },
    servers: [
      { url: "/", description: "Base" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    "src/routes/**/*.ts",
    "src/controllers/**/*.ts",
  ],
};

export const openapiSpec = swaggerJsdoc(options);

