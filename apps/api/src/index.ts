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
    ],
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

  console.log(`🚀 Server ready at http://localhost:${port}`);
}

start();
