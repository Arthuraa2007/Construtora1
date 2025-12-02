import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const getServerUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.API_URL || "https://clinica-api-o2tf.onrender.com";
  }
  return "http://localhost:3333";
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API da Construtora",
      version: "1.0.0",
      description: "API para gerenciar imóveis, corretores, clientes e secretários",
    },
    servers: [
      {
        url: getServerUrl(),
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
