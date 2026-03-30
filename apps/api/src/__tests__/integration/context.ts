/*
this file create fake graphqL context objects that simulate different authentication state
makeAdminContext() is for simulating a loggin admin
makeUserContext() is for simulating a normal loggin user
makeUnauthContext() is for simulating a unauthenticated request
*/

import { PrismaClient, Role } from "@prisma/client";
import { GraphQLContext } from "@graphql/context";
import { GraphQLError } from "graphql";

export function makeAdminContext(
  prisma: PrismaClient,
  userId: string,
): GraphQLContext {
  return {
    user: { uid: userId, email: "admin@test.com", role: Role.ADMIN },
    prisma,
    auth: {
      requireAuth: () => userId,
      getUserId: () => userId,
      isAdmin: () => true,
    },
  };
}

export function makeUserContext(
  prisma: PrismaClient,
  userId: string,
): GraphQLContext {
  return {
    user: { uid: userId, email: "user@test.com", role: Role.USER },
    prisma,
    auth: {
      requireAuth: () => userId,
      getUserId: () => userId,
      isAdmin: () => false,
    },
  };
}

export function makeUnauthContext(prisma: PrismaClient): GraphQLContext {
  return {
    user: null,
    prisma,
    auth: {
      requireAuth: () => {
        throw new GraphQLError("Authentication required");
      },
      getUserId: () => null,
      isAdmin: () => false,
    },
  };
}
