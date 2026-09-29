import { ApolloServer } from "@apollo/server";
import { schema } from "../../schema";
import { GraphQLContext } from "@graphql/context";
import { formatError } from "@lib/formatError";

let server: ApolloServer<GraphQLContext> | null = null;

export async function getTestServer(): Promise<ApolloServer<GraphQLContext>> {
  if (!server) {
    // Same error formatting as the real server, so tests see what clients see.
    server = new ApolloServer<GraphQLContext>({ schema, formatError });
    await server.start();
  }
  return server;
}

export async function stopTestServer(): Promise<void> {
  if (server) {
    await server.stop();
    server = null;
  }
}
