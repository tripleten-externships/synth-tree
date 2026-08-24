import { gql } from "graphql-tag";

export const learnerCourseTreeQueries = gql`
  extend type Query {
    courseForLearner(id: ID!): Course        // This creates a dedicated endpoint that returns everything a learner needs to render their skill tree for a given course.
  }

  extend type SkillNode {
    progressForViewer: UserNodeProgress      //This allows each node to expose the learner’s personal progress state.
  }
`;

export const learnerCourseTreeResolvers = {
  Query: {
    async courseForLearner(_, { id }, ctx) {
      return ctx.prisma.course.findUnique({
        //the resolver loads the course, skill tress, all nodes in the tree, each node's prerequisite edges
        where: { id },
        include: {
          trees: {
            include: {
              nodes: {
                include: {
                  prerequisites: true,
                },
              },
            },
          },
        },
      });
    },
  },

  SkillNode: {
    async progressForViewer(node, _, ctx) {
      const userId = ctx.user?.id;
      if (!userId) return null;

      return ctx.prisma.userNodeProgress.findUnique({
        //Returns the learner's actual progress fro each node:NOT_STARTED,IN_PROGRESS, COMPLETED, completeAt timestamps essential for node state logic (locked, unlocked, completed).
        where: {
          userId_nodeId: {
            userId,
            nodeId: node.id,
          },
        },
      });
    },
  },
};
