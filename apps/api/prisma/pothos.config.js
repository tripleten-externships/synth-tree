/** @type {import('prisma-generator-pothos-codegen').Config} */
module.exports = {
  inputs: {
    outputFilePath: "./src/graphql/__generated__/inputs.ts",
    prismaImporter: "import type { Prisma } from '@prisma/client';",
  },
  crud: {
    outputDir: "./src/graphql/__generated__/",
    inputsImporter: `import * as Inputs from '@graphql/__generated__/inputs';`,
    resolverImports: `import { prisma } from '@lib/prisma';`,
    prismaCaller: "prisma",
    prismaImporter: "import type { Prisma } from '@prisma/client';",
    deleteOutputDirBeforeGenerate: true, // Clean stale files
  },
  global: {
    builderLocation: `./src/graphql/builder`,
  },
};
