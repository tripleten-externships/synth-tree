const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// The Pothos inputs in src/graphql/__generated__ are gitignored and only rebuilt
// by `prisma generate`. After a branch checkout they can still match the old
// schema.prisma, so the tests would run against filters the branch removed.
// git rewrites schema.prisma on checkout when it differs, so regenerate when
// the schema or the Pothos config is newer than the generated inputs.
const generatedInputs = path.join(__dirname, "src/graphql/__generated__/inputs.ts");
const sources = ["prisma/schema.prisma", "prisma/pothos.config.js"].map((file) =>
  path.join(__dirname, file),
);

function modifiedAt(file) {
  return fs.existsSync(file) ? fs.statSync(file).mtimeMs : 0;
}

module.exports = () => {
  const generatedAt = modifiedAt(generatedInputs);
  if (sources.every((source) => modifiedAt(source) <= generatedAt)) return;

  execSync("pnpm exec prisma generate", {
    cwd: __dirname,
    stdio: "inherit",
    env: { ...process.env, CHECKPOINT_DISABLE: "1" },
  });
};
