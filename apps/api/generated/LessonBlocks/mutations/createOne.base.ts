import * as Inputs from '../../inputs';
import { builder } from '../../../builder';
import { defineMutation, defineMutationFunction, defineMutationPrismaObject } from '../../utils';

export const createOneLessonBlocksMutationArgs = builder.args((t) => ({ data: t.field({ type: Inputs.LessonBlocksCreateInput, required: true }) }))

export const createOneLessonBlocksMutationObject = defineMutationFunction((t) =>
  defineMutationPrismaObject({
    type: 'LessonBlocks',
    nullable: false,
    args: createOneLessonBlocksMutationArgs,
    resolve: async (query, _root, args, _context, _info) =>
      await _context.prisma.lessonBlocks.create({ data: args.data, ...query }),
  }),
);

export const createOneLessonBlocksMutation = defineMutation((t) => ({
  createOneLessonBlocks: t.prismaField(createOneLessonBlocksMutationObject(t)),
}));
