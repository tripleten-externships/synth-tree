import { builder } from "@graphql/builder";
import { CourseStatus } from "@graphql/__generated__/inputs";

/**
 * Public course catalog queries for students to browse and search published courses
 */
builder.queryFields((t) => ({
  /**
   * Browse published courses - public access for all users
   */
  browseCourses: t.prismaField({
    type: ["Course"],
    args: {
      search: t.arg.string({ required: false }),
      category: t.arg.string({ required: false }),
      page: t.arg.int({ required: false }),
      limit: t.arg.int({ required: false }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { search, category, page = 1, limit = 20 } = args;

      return ctx.prisma.course.findMany({
        ...query,
        where: {
          deletedAt: null,
          status: "PUBLISHED", // Only published courses
          ...(search
            ? {
                OR: [
                  {
                    title: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: search,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {}),
          // Note: category filtering would need a category field in the Course model
          // For now, commented out until schema is updated
          // ...(category ? { category } : {}),
        },
        skip: (page! - 1) * limit!,
        take: limit!,
        orderBy: { createdAt: "desc" },
        include: {
          author: true, // Include author info for display
        },
      });
    },
  }),

  /**
   * Get a single published course by ID - public access
   */
  browseCourse: t.prismaField({
    type: "Course",
    nullable: true,
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, ctx) => {
      const course = await ctx.prisma.course.findFirst({
        ...query,
        where: {
          id,
          deletedAt: null,
          status: "PUBLISHED",
        },
        include: {
          author: true,
          trees: {
            where: { deletedAt: null },
          },
        },
      });

      return course;
    },
  }),
}));
