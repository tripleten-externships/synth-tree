import { GraphQLError } from "graphql";

// Helper function for authentication in resolvers. Call context.auth.isAdmin() to check if user is a admin
export function requireAdmin(context: any) {
  if (!context.auth.isAdmin()) {
    throw new GraphQLError("Admin access required", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
}
