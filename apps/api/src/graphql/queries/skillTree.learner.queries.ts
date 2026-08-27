// The GraphQL builder is the project's standard way of defining schema fields.
// It wraps Prisma queries, enforces types, and integrates with codegen.
import { builder } from "@graphql/builder";

//
// ────────────────────────────────────────────────────────────────
//   QUERY: courseForLearner
//   Returns everything the learner UI needs to render the skill tree
//   in a *single* round trip.
// ────────────────────────────────────────────────────────────────
//
builder.queryFields((t) => ({
  courseForLearner: t.prismaField({
    // The return type is Course — this matches the GraphQL schema.
    type: "Course",

    // The query requires a course ID so the learner can request
    // the specific course they are viewing.
    args: {
      id: t.arg.id({ required: true }),
    },

    // The resolver runs when the query is executed.
    // It loads the course, its trees, their nodes, and prerequisites.
    resolve: async (query, _parent, args, ctx) => {
      // Enforce authentication. The learner must be logged in.
      // This returns the viewer's userId, used later for progress lookup.
      const userId = ctx.auth.requireAuth();

      // Prisma query that loads the entire skill tree structure.
      // This includes:
      // - course
      // - trees belonging to the course
      // - nodes inside each tree
      // - prerequisite edges for each node
      return ctx.prisma.course.findUnique({
        where: { id: args.id },

        include: {
          trees: {
            // Only return active (non-deleted) trees.
            where: { deletedAt: null },

            include: {
              nodes: {
                // Only return active (non-deleted) nodes.
                where: { deletedAt: null },

                include: {
                  // Load prerequisite edges for each node.
                  // The UI uses these to draw arrows between nodes.
                  prerequisites: true,
                },
              },
            },
          },
        },
      });
    },
  }),
}));


//
// ────────────────────────────────────────────────────────────────
//   FIELD: SkillNode.progressForViewer
//   Adds the learner's personal progress state to each node.
//   This is resolved *per node* and merged into the final query.
// ────────────────────────────────────────────────────────────────
//
builder.prismaObjectField("SkillNode", "progressForViewer", (t) =>
  t.prismaField({
    // The return type is UserNodeProgress — nullable because
    // the learner may not have started the node yet.
    type: "UserNodeProgress",
    nullable: true,

    // Resolver runs for each node in the tree.
    resolve: async (query, _parent, _args, ctx) => {
      // Require authentication again — ensures the viewer is known.
      const userId = ctx.auth.requireAuth();

      // The node ID comes from the parent SkillNode object.
      const nodeId = _parent.id;

      // Look up the learner's progress for this specific node.
      // Uses the composite key (userId + nodeId).
      // Returns:
      // - status (NOT_STARTED, IN_PROGRESS, COMPLETED)
      // - completedAt timestamp
      return ctx.prisma.userNodeProgress.findUnique({
        where: {
          userId_nodeId: {
            userId,
            nodeId,
          },
        },
      });
    },
  })
);
