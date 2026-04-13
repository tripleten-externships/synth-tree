import "dotenv/config";
import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { schema } from "./schema";
import { createGraphQLContext, GraphQLContext } from "@graphql/context";
import { prisma } from "@lib/prisma";
import { apolloLoggingPlugin } from "@lib/apolloLoggingPlugin"; // Custom plugin that logs GraphQL request lifecycle + errors with context
import logger from "@lib/logger"; // Centralized Pino logger (pretty in dev, JSON in prod)

async function start() {
  const app = express();
  const httpServer = http.createServer(app);

  // Health check endpoint
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  // Enable CORS and JSON parsing
  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer<GraphQLContext>({
    schema,
    introspection: true,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
        includeCookies: true,
      }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      apolloLoggingPlugin, // Enables structured logging for every GraphQL request + error
    ],
      formatError: (formattedError) => { 
        // In production, hide stack traces and internal details from clients
        if (process.env.NODE_ENV === 'production') {
        return {
        message: formattedError.message,
        extensions: { code: formattedError.extensions?.code },
      };
  }
  return formattedError; // Full error details in development
},
  });

  await server.start();

  app.use(
    "/",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return createGraphQLContext({ req, prisma });
      },
    })
  );

  const port = parseInt(process.env.PORT || "4000", 10);
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

  logger.info(`🚀 Server ready at http://localhost:${port}`); // Log server startup for visibility in local/dev environments
}

start();
