/** @type {import('prisma-generator-pothos-codegen').Config} */
module.exports = {
  inputs: {
    // paths are relative to the `prisma` folder for this config file, adjust to reach src
    outputFilePath: "../src/graphql/__generated__/inputs.ts",
    prismaImporter: "import type { Prisma } from '@prisma/client';",
  },
  crud: {
    outputDir: "../src/graphql/__generated/",
    inputsImporter: `import * as Inputs from '@graphql/__generated__/inputs';`,
    resolverImports: `import { prisma } from '@lib/prisma';`,
    prismaCaller: "prisma",
    prismaImporter: "import type { Prisma } from '@prisma/client';",
  },
  global: {
    builderLocation: `./src/graphql/builder`,
  },
};
