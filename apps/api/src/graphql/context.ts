import { Request } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { AuthenticationError } from "apollo-server-errors";
import { admin } from "../firebase";

export interface GraphQLContext {
  user: {
    uid: string;
    email?: string;
    role?: Role;
  } | null;
  prisma: PrismaClient;
  auth: {
    requireAuth: () => string;
    getUserId: () => string | null;
    isAdmin: () => boolean;
  };
}

export async function createGraphQLContext({
  req,
  prisma,
}: {
  req: Request;
  prisma: PrismaClient;
}): Promise<GraphQLContext> {
  let user: { uid: string; email?: string; role: Role } | null = null;

  // Extract and verify token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (admin) {
      try {
        const decoded = await admin.auth().verifyIdToken(token);
        const userRecord = await prisma.user.findUnique({
          where: { id: decoded.uid },
        });
        if (!userRecord) {
          throw new AuthenticationError(`No user found for UID ${decoded.uid}`);
        }
        user = {
          uid: decoded.uid,
          email: decoded.email,
          role: userRecord.role,
        };
      } catch (error) {
        // Token verification failed, user remains null
        console.error("Token verification failed:", error);
      }
    }
  }

  // Create auth helper methods bound to the current user
  const auth = {
    requireAuth: (): string => {
      const userId = auth.getUserId();
      if (!userId) {
        throw new AuthenticationError("Authentication required");
      }
      return userId;
    },

    getUserId: (): string | null => {
      return user?.uid ?? null;
    },

    isAdmin: (): boolean => {
      return user?.role === Role.ADMIN;
    },
  };

  return {
    user,
    prisma,
    auth,
  };
}
