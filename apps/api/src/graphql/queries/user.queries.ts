import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";

// get all users for admin
// At least one root level query is required.

// Pagination included use limit and offset. They make to prisma skip and take.

builder.queryFields((t) => ({
  allUsers: t.prismaField({
    type: ["User"],
    args: {
      limit: t.arg.int({
        required: false,
        defaultValue: 25, // default page size
      }),
      offset: t.arg.int({
        required: false,
        defaultValue: 0, // default start
      }),
    },
    resolve: async (query, _parent, args, context) => {
      context.auth.requireAuth();
      requireAdmin(context);

      const rawLimit = args.limit ?? 25;
      const rawOffset = args.offset ?? 0;

      // Prevent insane page sizes
      const limit = Math.min(Math.max(rawLimit, 1), 100); // 1–100
      const offset = Math.max(rawOffset, 0);

      return context.prisma.user.findMany({
        ...query,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  }),
}));
