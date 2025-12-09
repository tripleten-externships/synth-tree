import { builder } from "@graphql/builder";

export const CreateFirstSkillNodeInput = builder.inputType(
  "CreateFirstSkillNodeInput",
  {
    fields: (t) => ({
      treeId: t.id({ required: true }),
      title: t.string({ required: true }),
    }),
  }
);

export const CreateSkillNodeToRightInput = builder.inputType(
  "CreateSkillNodeToRightInput",
  {
    fields: (t) => ({
      referenceNodeId: t.id({ required: true }),
      title: t.string({ required: true }),
    }),
  }
);

export const CreateSkillNodeBelowInput = builder.inputType(
  "CreateSkillNodeBelowInput",
  {
    fields: (t) => ({
      referenceNodeId: t.id({ required: true }),
      title: t.string({ required: true }),
    }),
  }
);

export const UpdateSkillNodeInput = builder.inputType("UpdateSkillNodeInput", {
  fields: (t) => ({
    title: t.string(),
    // No support for step or orderInStep updates right now. Should probably remove prerequisites from prisma and enforce gating with frontend logic.
    posX: t.int(),
    posY: t.int(),
  }),
});
