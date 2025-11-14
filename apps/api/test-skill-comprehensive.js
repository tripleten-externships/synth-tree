const http = require("http");

const post = (query, variables) =>
  new Promise((res, rej) => {
    const body = JSON.stringify({ query, variables });
    const req = http.request(
      {
        hostname: "localhost",
        port: 4000,
        path: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": body.length,
        },
      },
      (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => {
          try {
            res(JSON.parse(d));
          } catch (e) {
            rej(e);
          }
        });
      }
    );
    req.on("error", rej);
    req.write(body);
    req.end();
  });

const tests = [
  {
    name: "Query: skillTrees returns list",
    query: `query { skillTrees { id title description } }`,
    check: (res) => Array.isArray(res.data.skillTrees),
  },
  {
    name: "Query: skillTree by valid id",
    query: `query ($id: ID!) { skillTree(id: $id) { id title nodes { id title } } }`,
    variables: { id: "1" },
    check: (res) => res.data.skillTree === null || res.data.skillTree.id,
  },
  {
    name: "Query: skillTree with null id (should fail gracefully)",
    query: `query { skillTree(id: null) { id } }`,
    check: (res) => res.errors && res.errors.length > 0,
  },
  {
    name: "Mutation: createSkillTree requires admin (should fail without auth)",
    query: `mutation ($input: CreateSkillTreeInput!) { createSkillTree(input: $input) { id } }`,
    variables: {
      input: { courseId: "c1", title: "Test Tree", description: "Test" },
    },
    check: (res) =>
      res.errors && res.errors.some((e) => e.message.includes("admin")),
  },
  {
    name: "Mutation: createSkillNode requires admin (should fail without auth)",
    query: `mutation ($input: CreateSkillNodeInput!) { createSkillNode(input: $input) { id } }`,
    variables: { input: { treeId: "t1", title: "Test Node", step: 1 } },
    check: (res) =>
      res.errors && res.errors.some((e) => e.message.includes("admin")),
  },
  {
    name: "Mutation: updateSkillNode requires admin (should fail without auth)",
    query: `mutation ($id: ID!, $input: UpdateSkillNodeInput!) { updateSkillNode(id: $id, input: $input) { id } }`,
    variables: { id: "n1", input: { title: "Updated" } },
    check: (res) =>
      res.errors && res.errors.some((e) => e.message.includes("admin")),
  },
  {
    name: "Query: skillTree includes nodes relationship",
    query: `query ($id: ID!) { skillTree(id: $id) { id nodes { id title treeId } } }`,
    variables: { id: "1" },
    check: (res) => !res.errors || res.data.skillTree === null,
  },
  {
    name: "Query: SkillNode includes prerequisites relationship",
    query: `query { skillTrees { nodes { id prerequisites { nodeId dependsOnNodeId } } } }`,
    check: (res) => !res.errors,
  },
  {
    name: "Query: SkillNode includes tree relationship",
    query: `query { skillTrees { nodes { id tree { id title } } } }`,
    check: (res) => !res.errors,
  },
  {
    name: "Query: schema introspection - Query type has skillTree and skillTrees",
    query: `{ __schema { queryType { fields { name } } } }`,
    check: (res) => {
      const fields = res.data.__schema.queryType.fields.map((f) => f.name);
      return fields.includes("skillTree") && fields.includes("skillTrees");
    },
  },
  {
    name: "Query: schema introspection - Mutation type has custom skill mutations",
    query: `{ __schema { mutationType { fields { name } } } }`,
    check: (res) => {
      const fields = res.data.__schema.mutationType.fields.map((f) => f.name);
      return (
        fields.includes("createSkillTree") &&
        fields.includes("createSkillNode") &&
        fields.includes("updateSkillNode")
      );
    },
  },
  {
    name: "Query: SkillTree type has nodes field",
    query: `{ __type(name: "SkillTree") { fields { name } } }`,
    check: (res) => {
      const fields = res.data.__type.fields.map((f) => f.name);
      return fields.includes("nodes");
    },
  },
  {
    name: "Query: SkillNode type has prerequisites field",
    query: `{ __type(name: "SkillNode") { fields { name } } }`,
    check: (res) => {
      const fields = res.data.__type.fields.map((f) => f.name);
      return fields.includes("prerequisites");
    },
  },
];

(async () => {
  console.log(`\n🧪 Running ${tests.length} tests...\n`);
  let passed = 0,
    failed = 0;

  for (const test of tests) {
    try {
      const res = await post(test.query, test.variables || {});
      const pass = test.check(res);
      if (pass) {
        console.log(`✅ ${test.name}`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   Response:`, JSON.stringify(res, null, 2).slice(0, 200));
        failed++;
      }
    } catch (e) {
      console.log(`❌ ${test.name} (error: ${e.message})`);
      failed++;
    }
  }

  console.log(
    `\n📊 Results: ${passed} passed, ${failed} failed out of ${tests.length} tests\n`
  );
  process.exit(failed > 0 ? 1 : 0);
})();
