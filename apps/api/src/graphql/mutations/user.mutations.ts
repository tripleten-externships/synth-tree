import { GraphQLError } from "graphql";
import { builder } from "@graphql/builder";
import { Prisma, Role as PrismaRole } from "@prisma/client";
import { Role as RoleEnum } from "@graphql/__generated__/inputs";
import { requireAdmin } from "@graphql/auth/requireAuth";
import logger from "@lib/logger"; // Structured logger for tracking user sync and account events

// Canonical onboarding subjects. Must stay in sync with SUBJECTS in the client
// SignUpPage (apps/client-frontend/src/pages/auth/SignUpPage.tsx).
const ALLOWED_INTERESTS = new Set<string>([
  "Chemistry",
  "Physics",
  "Biology",
  "Mathematics",
  "Computer science",
  "Statistics",
  "Earth science",
  "Astronomy",
]);

// Daily goal options in minutes. Must stay in sync with DAILY_GOALS in the client
// SignUpPage (apps/client-frontend/src/pages/auth/SignUpPage.tsx).
const ALLOWED_DAILY_GOALS = new Set<number>([5, 15, 30, 60]);

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
      logger.debug({ userId: firebaseUid }, "Syncing current user"); // Debug-level log to trace user sync flow during development
      const ctxUser = context.user;

      const email = ctxUser?.email ?? null;
      if (!email) {
        throw new GraphQLError(
          "Authenticated Firebase user has no email; cannot sync user record",
          { extensions: { code: "UNAUTHENTICATED" } },
        );
      }

      const existingByEmail = await context.prisma.user.findUnique({
        where: { email },
      });

      if (existingByEmail && existingByEmail.id !== firebaseUid) {
        throw new GraphQLError("Email is already associated with a different user account", {
          extensions: { code: "BAD_USER_INPUT" },
        });
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
          ...(args.name !== null && args.name !== undefined ? { name: args.name } : {}),
          ...(args.photoUrl !== null && args.photoUrl !== undefined
            ? { photoUrl: args.photoUrl }
            : {}),
        },
      });

      logger.info({ userId: user.id, email: user.email }, "User synced"); // High-level audit log for successful user creation/update
      return user;
    },
  }),

  // Save onboarding selections for the signed-in user.
  // Step 2 (SYN-46) sends interests; step 3 (SYN-47) sends dailyGoalMinutes, which finishes onboarding.
  // The User row already exists (created by syncCurrentUser in step 1), so this is a plain update.
  updateOnboarding: t.prismaField({
    type: "User",
    args: {
      // Optional so step 3 can save the goal without overwriting step 2's picks.
      // An empty array is valid and means the user skipped picking interests.
      interests: t.arg({ type: ["String"], required: false }),
      dailyGoalMinutes: t.arg.int({ required: false }),
    },
    resolve: async (query, _parent, args, context) => {
      const firebaseUid = context.auth.requireAuth();

      const data: Prisma.UserUpdateInput = {};

      if (args.interests != null) {
        // Validate against the known subject list rather than persisting arbitrary
        // client input. Dedupe, and reject anything off-list — this also caps the
        // array size and rejects oversized/junk strings.
        // NOTE: keep in sync with SUBJECTS in the client SignUpPage (ideally a
        // shared constant later).
        const uniqueInterests = Array.from(new Set(args.interests));
        const invalid = uniqueInterests.filter((s) => !ALLOWED_INTERESTS.has(s));
        if (invalid.length > 0) {
          throw new GraphQLError(`Unknown interest(s): ${invalid.join(", ")}`);
        }
        data.interests = uniqueInterests;
      }

      if (args.dailyGoalMinutes != null) {
        if (!ALLOWED_DAILY_GOALS.has(args.dailyGoalMinutes)) {
          throw new GraphQLError(
            `Invalid daily goal: ${args.dailyGoalMinutes}. Choose 5, 15, 30, or 60 minutes.`,
            { extensions: { code: "BAD_USER_INPUT" } },
          );
        }
        // Picking a daily goal is the last onboarding step.
        data.dailyGoalMinutes = args.dailyGoalMinutes;
        data.onboardingComplete = true;
      }

      if (Object.keys(data).length === 0) {
        throw new GraphQLError("Nothing to update: provide interests or dailyGoalMinutes", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const user = await context.prisma.user.update({
        ...query,
        where: { id: firebaseUid },
        data,
      });

      logger.info(
        { userId: user.id, onboardingComplete: data.onboardingComplete === true },
        "Onboarding saved",
      );
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
        throw new GraphQLError(`User with id ${userId} does not exist`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
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
