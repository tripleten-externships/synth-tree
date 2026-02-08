import { AuthenticationError } from "apollo-server-errors";
import { GraphQLContext } from "@graphql/context";
// Helper function for authentication in resolvers. Call context.auth.isAdmin() to check if user is a admin

export function requireAdmin(context: GraphQLContext) {
  if (!context.auth.isAdmin()) {
    throw new AuthenticationError("Admin access required");
  }
}
