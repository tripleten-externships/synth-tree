// Ids for courses, trees, nodes, etc. are Postgres UUID columns. Querying one
// with a malformed value (e.g. "1" from a hand-typed or placeholder URL) makes
// Prisma throw "Inconsistent column data" instead of finding nothing, so
// resolvers that take an id straight from a route check it first.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}
