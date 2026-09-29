import { GraphQLError } from "graphql";
import { Prisma } from "@prisma/client";
import { formatError, INTERNAL_ERROR_MESSAGE } from "./formatError";

jest.mock("./logger", () => ({ __esModule: true, default: { error: jest.fn() } }));

const PRISMA_MESSAGE =
  "Invalid `prisma.course.findUniqueOrThrow()` invocation in\n/app/apps/api/src/graphql/auth/permissions.ts:11:43\n\nNo record was found for a query.";

// Mimics what Apollo passes formatError for an error thrown inside a resolver:
// graphql-js wraps it in a GraphQLError with a path and the original error.
function fromResolver(original: Error) {
  const error = new GraphQLError(original.message, {
    path: ["course"],
    originalError: original,
    extensions: original instanceof GraphQLError ? original.extensions : undefined,
  });
  const formatted = {
    ...error.toJSON(),
    extensions: {
      code: "INTERNAL_SERVER_ERROR",
      ...error.extensions,
      stacktrace: ["Error: at /app/apps/api/src/index.ts:1:1"],
    },
  };
  return [formatted, error] as const;
}

describe("formatError", () => {
  const originalEnv = process.env.EXPOSE_INTERNAL_ERRORS;

  afterEach(() => {
    if (originalEnv === undefined) delete process.env.EXPOSE_INTERNAL_ERRORS;
    else process.env.EXPOSE_INTERNAL_ERRORS = originalEnv;
  });

  it.each([
    [
      "known request",
      new Prisma.PrismaClientKnownRequestError(PRISMA_MESSAGE, {
        code: "P2025",
        clientVersion: "6.17.1",
      }),
    ],
    [
      "unknown request",
      new Prisma.PrismaClientUnknownRequestError(PRISMA_MESSAGE, { clientVersion: "6.17.1" }),
    ],
    [
      "validation",
      new Prisma.PrismaClientValidationError(PRISMA_MESSAGE, { clientVersion: "6.17.1" }),
    ],
    ["rust panic", new Prisma.PrismaClientRustPanicError(PRISMA_MESSAGE, "6.17.1")],
    ["initialization", new Prisma.PrismaClientInitializationError(PRISMA_MESSAGE, "6.17.1")],
  ])("masks a Prisma %s error", (_kind, prismaError) => {
    const result = formatError(...fromResolver(prismaError));

    expect(result.message).toBe(INTERNAL_ERROR_MESSAGE);
    expect(result.extensions).toEqual({ code: "INTERNAL_SERVER_ERROR" });
    expect(result.path).toEqual(["course"]);
    expect(JSON.stringify(result)).not.toContain("/app/");
  });

  it("masks a Prisma error wrapped in a GraphQLError", () => {
    const prismaError = new Prisma.PrismaClientInitializationError(PRISMA_MESSAGE, "6.17.1");
    const error = new GraphQLError(`Context creation failed: ${PRISMA_MESSAGE}`, {
      originalError: prismaError,
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });

    const result = formatError(error.toJSON(), error);

    expect(result.message).toBe(INTERNAL_ERROR_MESSAGE);
  });

  it("masks a plain Error thrown by a resolver", () => {
    const result = formatError(...fromResolver(new Error("connect ECONNREFUSED 10.0.0.5:5432")));

    expect(result.message).toBe(INTERNAL_ERROR_MESSAGE);
  });

  it("keeps an intentional GraphQLError without a code, minus the stack trace", () => {
    const result = formatError(...fromResolver(new GraphQLError("Course not found")));

    expect(result.message).toBe("Course not found");
    expect(result.extensions).not.toHaveProperty("stacktrace");
  });

  it("keeps an intentional GraphQLError with a known code", () => {
    const result = formatError(
      ...fromResolver(
        new GraphQLError("You do not have access to this course", {
          extensions: { code: "FORBIDDEN" },
        }),
      ),
    );

    expect(result.message).toBe("You do not have access to this course");
    expect(result.extensions?.code).toBe("FORBIDDEN");
  });

  it("keeps request errors such as bad variables", () => {
    const error = new GraphQLError('Variable "$id" of required type "ID!" was not provided.', {
      extensions: { code: "BAD_USER_INPUT" },
    });

    const result = formatError(error.toJSON(), error);

    expect(result.message).toBe('Variable "$id" of required type "ID!" was not provided.');
  });

  it("passes everything through when EXPOSE_INTERNAL_ERRORS=true", () => {
    process.env.EXPOSE_INTERNAL_ERRORS = "true";
    const [formatted, error] = fromResolver(
      new Prisma.PrismaClientKnownRequestError(PRISMA_MESSAGE, {
        code: "P2025",
        clientVersion: "6.17.1",
      }),
    );

    expect(formatError(formatted, error)).toBe(formatted);
  });
});
