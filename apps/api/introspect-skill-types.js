const http = require("http");

const typesToCheck = ["SkillTree", "SkillNode", "SkillNodePrerequisite"];
const query = `query Introspect($name:String!){ __type(name:$name){ name fields { name type { name kind ofType { name kind } } } } }`;

const post = (body) =>
  new Promise((res, rej) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 4000,
        path: "/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => res(JSON.parse(d)));
      }
    );
    req.on("error", (e) => rej(e));
    req.write(JSON.stringify(body));
    req.end();
  });

(async () => {
  for (const name of typesToCheck) {
    try {
      const result = await post({ query, variables: { name } });
      const type = result.data && result.data.__type;
      if (!type) {
        console.log(`${name}: NOT FOUND`);
        continue;
      }
      console.log(`\n${name}:`);
      for (const f of type.fields) {
        console.log(`  - ${f.name}`);
      }
    } catch (e) {
      console.error("error", e.message || e);
      process.exit(2);
    }
  }
  process.exit(0);
})();
