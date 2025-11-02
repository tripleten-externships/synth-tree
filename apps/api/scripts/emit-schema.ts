import { printSchema } from "graphql";
import { writeFileSync } from "fs";
import path from "path";
import { schema } from "../src/schema"; // your Pothos-built schema

const schemaSDL = printSchema(schema);
const outputPath = path.join(__dirname, "../src/graphql/schema.graphql");
writeFileSync(outputPath, schemaSDL);
console.log(`✅ Wrote GraphQL schema to ${outputPath}`);
