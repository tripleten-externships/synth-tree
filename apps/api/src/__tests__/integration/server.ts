import { ApolloServer } from "@apollo/server";
import { schema } from "../../schema";
import { GraphQLContext } from "@graphql/context";

let server: ApolloServer<GraphQLContext> | null = null;

export async function getTestServer(): Promise<ApolloServer<GraphQLContext>> {
  if (!server) {
    server = new ApolloServer<GraphQLContext>({ schema });
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
