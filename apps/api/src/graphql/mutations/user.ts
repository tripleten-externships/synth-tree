import { AuthenticationError, UserInputError } from "apollo-server-errors";
import { builder } from "@graphql/builder";
import { Role as PrismaRole } from "@prisma/client";
import { Role as RoleEnum } from "@graphql/__generated__/inputs";
import { requireAdmin } from "@graphql/auth/requireAuth";

// Sync current User.
// A token will be sent in the headers of the Apollo Client from the frontend when a User signs up through the firebase sdk
// This function creates a user in our postgres database and hence makes it an official prisma model.

builder.mutationFields((t) => ({
  syncCurrentUser: t.prismaField({
    type: "User",
    args: {
      // Allow the user to send in name and photoUrl from frontend.
      name: t.arg.string(),
      photoUrl: t.arg.string(),
    },
    resolve: async (query, _parent, args, context) => {
      const firebaseUid = context.auth.requireAuth();
      const ctxUser = context.user;

      const email = ctxUser?.email ?? null;
      if (!email) {
        throw new AuthenticationError(
          "Authenticated Firebase user has no email; cannot sync user record"
        );
      }

      const existingByEmail = await context.prisma.user.findUnique({
        where: { email },
      });

      if (existingByEmail && existingByEmail.id !== firebaseUid) {
        throw new UserInputError(
          "Email is already associated with a different user account"
        );
      }

      const user = await context.prisma.user.upsert({
        ...query,
        where: { id: firebaseUid },
        create: {
          id: firebaseUid,
          email,
          name: args.name ?? null,
          photoUrl: args.photoUrl ?? null,
          role: PrismaRole.USER, // use Prisma enum
        },
        update: {
          email,
          name: args.name ?? null,
          photoUrl: args.photoUrl ?? null,
        },
      });

      return user;
    },
  }),

  deleteUser: t.prismaField({
    type: "User",
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _parent, args, context) => {
      context.auth.requireAuth();
      requireAdmin(context);

      const userId = String(args.id);

      // 1) Fetch the user (with selection set)
      const existing = await context.prisma.user.findUnique({
        ...query,
        where: { id: userId },
      });

      if (!existing) {
        throw new UserInputError(`User with id ${userId} does not exist`);
      }

      // 2) Delete the user
      await context.prisma.user.delete({
        where: { id: userId },
      });

      // Return the user that was deleted

      return existing;
    },
  }),
  setUserRole: t.prismaField({
    type: "User",
    args: {
      userId: t.arg.id({ required: true }),
      role: t.arg({ type: RoleEnum, required: true }), //  GraphQL enum ref from pothos. Import these from __generated__/inputs
    },
    resolve: async (query, _parent, args, context) => {
      context.auth.requireAuth();
      requireAdmin(context);

      const userId = String(args.userId);

      const updated = await context.prisma.user.update({
        ...query,
        where: { id: userId },
        data: {
          role: args.role as PrismaRole, //  cast GraphQL → Prisma enum
        },
      });

      return updated;
    },
  }),
}));
