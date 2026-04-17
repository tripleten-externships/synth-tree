import { Request } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { GraphQLError } from "graphql";
import { admin } from "../firebase";
import logger from '@lib/logger'; // Logger used for auth-related warnings and request context visibility

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
        // Don't throw if user not found — syncCurrentUser will create them
        user = userRecord ? {
          uid: decoded.uid,
          email: decoded.email,
          role: userRecord.role,
        } : {
          uid: decoded.uid,
         email: decoded.email,
          role: Role.USER,
        };
      } catch (error) {
        // Token verification failed, user remains null
        logger.warn({ err: error }, 'Token verification failed'); // Warn when Firebase token verification fails — user remains unauthenticated
      }
    }
  }

  // Create auth helper methods bound to the current user
  const auth = {
    requireAuth: (): string => {
      const userId = auth.getUserId();
      if (!userId) {
        throw new GraphQLError("Authentication required");
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
