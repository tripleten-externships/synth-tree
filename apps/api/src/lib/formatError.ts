import { GraphQLError, type GraphQLFormattedError } from "graphql";
import { unwrapResolverError } from "@apollo/server/errors";
import { Prisma } from "@prisma/client";
import logger from "./logger";

// Apollo `formatError` shared by the server and the integration test server.
//
// Errors we throw on purpose (GraphQLError, with or without an extensions
// code) and GraphQL's own request errors (parse, validation, bad variables)
// reach the client unchanged. Anything else, such as a Prisma error or a plain
// Error from a resolver, can carry internals (SQL, file paths, engine
// versions), so the client gets a generic message and the original is logged.
// Stack traces are never sent.
//
// Set EXPOSE_INTERNAL_ERRORS=true to send every error unchanged, stack traces
// included, when debugging locally. Never set it in a deployed environment.

export const INTERNAL_ERROR_MESSAGE = "Internal server error";

// Codes whose messages are written for the client.
const CLIENT_SAFE_CODES = new Set<string>([
  "BAD_USER_INPUT",
  "BAD_REQUEST",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "GRAPHQL_PARSE_FAILED",
  "GRAPHQL_VALIDATION_FAILED",
  "PERSISTED_QUERY_NOT_FOUND",
  "PERSISTED_QUERY_NOT_SUPPORTED",
  "OPERATION_RESOLUTION_FAILURE",
]);

function isPrismaError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientInitializationError
  );
}

// True if the error, or anything it wraps, came from Prisma. A GraphQLError can
// wrap one, e.g. Apollo's "Context creation failed" error.
function involvesPrismaError(error: unknown): boolean {
  let current: unknown = error;
  for (let depth = 0; current && depth < 5; depth++) {
    if (isPrismaError(current)) return true;
    current = current instanceof GraphQLError ? current.originalError : undefined;
  }
  return false;
}

function withoutStacktrace(formattedError: GraphQLFormattedError): GraphQLFormattedError {
  if (!formattedError.extensions || !("stacktrace" in formattedError.extensions)) {
    return formattedError;
  }
  const { stacktrace: _stacktrace, ...extensions } = formattedError.extensions;
  return { ...formattedError, extensions };
}

export function formatError(
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  if (process.env.EXPOSE_INTERNAL_ERRORS === "true") return formattedError;

  const original = unwrapResolverError(error);
  const code = formattedError.extensions?.code;

  const isClientSafe =
    !involvesPrismaError(original) &&
    ((typeof code === "string" && CLIENT_SAFE_CODES.has(code)) || original instanceof GraphQLError);

  if (isClientSafe) return withoutStacktrace(formattedError);

  logger.error({ err: original, path: formattedError.path }, "Internal error hidden from client");

  return {
    message: INTERNAL_ERROR_MESSAGE,
    locations: formattedError.locations,
    path: formattedError.path,
    extensions: { code: "INTERNAL_SERVER_ERROR" },
  };
}
