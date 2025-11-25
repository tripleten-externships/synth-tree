import { AuthenticationError } from "apollo-server-errors";
// Helper function for authentication in resolvers. Call context.auth.isAdmin() to check if user is a admin

export function requireAdmin(context: any) {
  if (!context.auth.isAdmin()) {
    throw new AuthenticationError("Admin access required");
  }
}
