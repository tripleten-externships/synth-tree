import { builder } from "./builder";
import { prisma } from "@lib/prisma";

// How it works:
// 1. Queries fetch customization data from DB (admin-only)
// 2. Mutations manage UI settings with ADMIN auth
// 3. Input validation ensures required fields are non-empty
// 4. Settings stored as JSON for flexibility
// 5. Instance ID provides unique component identification

// Input types
const SaveUICustomizationInput = builder.inputType("SaveUICustomizationInput", {
  fields: (t) => ({
    instanceId: t.string({ required: true }),
    componentType: t.string({ required: true }),
    settings: t.field({ type: "Json", required: true }),
  }),
});

// Admin auth helper
function assertAdmin(ctx: { user?: { id: string; role?: string } | null }) {
  if (!ctx.user || ctx.user.role !== "ADMIN") {
    throw new Error("Forbidden: admin access required for UI customizations");
  }
  return ctx.user;
}

// Input validation
function validateSaveCustomization(input: any) {
  if (!input.instanceId || input.instanceId.trim() === "") {
    throw new Error("Validation: instanceId is required and cannot be empty");
  }
  if (!input.componentType || input.componentType.trim() === "") {
    throw new Error(
      "Validation: componentType is required and cannot be empty"
    );
  }
  if (!input.settings) {
    throw new Error("Validation: settings is required");
  }
}

// Queries
builder.queryField("getUICustomization", (t) =>
  t.prismaField({
    type: "UIComponentCustomization",
    nullable: true,
    args: { instanceId: t.arg.string({ required: true }) },
    resolve: (_query, _root, args) => {
      return prisma.uIComponentCustomization.findUnique({
        where: { instanceId: args.instanceId },
        include: { creator: true },
      });
    },
  })
);

builder.queryField("listUICustomizations", (t) =>
  t.prismaField({
    type: ["UIComponentCustomization"],
    args: {
      componentType: t.arg.string({ required: false }),
      limit: t.arg.int({ required: false }),
    },
    resolve: (_query, _root, args, ctx) => {
      assertAdmin(ctx);

      const where: any = {};
      if (args.componentType) {
        where.componentType = args.componentType;
      }

      return prisma.uIComponentCustomization.findMany({
        where,
        take: args.limit || 50,
        include: { creator: true },
        orderBy: { updatedAt: "desc" },
      });
    },
  })
);

// Mutations
builder.mutationField("saveUICustomization", (t) =>
  t.prismaField({
    type: "UIComponentCustomization",
    args: { input: t.arg({ type: SaveUICustomizationInput, required: true }) },
    resolve: async (_query, _root, { input }, ctx) => {
      assertAdmin(ctx);
      validateSaveCustomization(input as any);

      const data = {
        instanceId: input.instanceId,
        componentType: input.componentType,
        settings: input.settings || {},
        createdBy: ctx.user!.id,
      };

      // Upsert operation
      return prisma.uIComponentCustomization.upsert({
        where: { instanceId: input.instanceId },
        update: {
          componentType: data.componentType,
          settings: data.settings,
          updatedAt: new Date(),
        },
        create: {
          instanceId: data.instanceId,
          componentType: data.componentType,
          settings: data.settings,
          creator: {
            connect: { id: data.createdBy },
          },
        },
        include: { creator: true },
      });
    },
  })
);

builder.mutationField("deleteUICustomization", (t) =>
  t.field({
    type: "Boolean",
    args: { instanceId: t.arg.string({ required: true }) },
    resolve: async (_root, { instanceId }, ctx) => {
      assertAdmin(ctx);

      if (!instanceId || instanceId.trim() === "") {
        throw new Error(
          "Validation: instanceId is required and cannot be empty"
        );
      }

      try {
        await prisma.uIComponentCustomization.delete({
          where: { instanceId },
        });
        return true;
      } catch (error: any) {
        if (error.code === "P2025") {
          throw new Error(
            `UI customization with instanceId '${instanceId}' not found`
          );
        }
        throw error;
      }
    },
  })
);
