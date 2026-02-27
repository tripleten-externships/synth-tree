import { builder } from "@graphql/builder";
import { requireAdmin } from "@graphql/auth/requireAuth";

builder.mutationFields((t) => ({
  /**
   * Set (or clear) an image URL on a quiz option.
   *
   * After the admin uploads an image via FileUpload and receives a public S3
   * URL, this mutation persists it to QuizOption.imageUrl.
   * Pass null to clear an existing image.
   *
   * Integration: ST-118 (quiz answer images) + FileUpload component (ST-70).
   */
  setQuizOptionImage: t.prismaField({
    type: "QuizOption",
    description: "Set or clear the image URL on a quiz answer option.",
    args: {
      id: t.arg.id({ required: true, description: "ID of the QuizOption." }),
      imageUrl: t.arg.string({
        required: false,
        description: "Public image URL from S3. Pass null to clear.",
      }),
    },
    resolve: async (_query, _parent, args, context) => {
      context.auth.requireAuth();
      requireAdmin(context);

      return await context.prisma.quizOption.update({
        where: { id: String(args.id) },
        data: { imageUrl: args.imageUrl ?? null },
      });
    },
  }),
}));
