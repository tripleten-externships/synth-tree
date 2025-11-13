import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const upsertOneLessonBlocksMutationArgs = builder.args((t) => ({
      where: t.field({ type: Inputs.LessonBlocksWhereUniqueInput, required: true }),
      create: t.field({ type: Inputs.LessonBlocksCreateInput, required: true }),
      update: t.field({ type: Inputs.LessonBlocksUpdateInput, required: true }),
    }))

export const upsertOneLessonBlocksMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'LessonBlocks',
    nullable: false,
    args: upsertOneLessonBlocksMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.lessonBlocks.upsert({
        where: args.where,
        create: args.create,
        update: args.update,
        ...query,
      }),
  }),
);

export const upsertOneLessonBlocksMutation = defineMutation((t) => ({
  upsertOneLessonBlocks: t.prismaField(upsertOneLessonBlocksMutationObject(t)),
}));
