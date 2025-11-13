const http = require("http");

const query = `
  {
    __schema {
      queryType {
        fields {
          name
        }
      }
      mutationType {
        fields {
          name
        }
      }
    }
  }
`;

const postData = JSON.stringify({ query });

const attemptRequest = (retries = 10, delay = 500) => {
  const options = {
    hostname: "localhost",
    port: 4000,
    path: "/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": postData.length,
    },
  };

  const req = http.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      const parsed = JSON.parse(data);
      const queryFields = parsed.data?.["__schema"]?.queryType?.fields || [];
      const mutationFields =
        parsed.data?.["__schema"]?.mutationType?.fields || [];

      console.log("\n📋 QUERY FIELDS:");
      queryFields.forEach((f) => console.log(`  - ${f.name}`));

      console.log("\n📝 MUTATION FIELDS:");
      mutationFields.forEach((f) => console.log(`  - ${f.name}`));

      const skillQueries = queryFields.filter((f) =>
        f.name.toLowerCase().includes("skill")
      );
      const skillMutations = mutationFields.filter((f) =>
        f.name.toLowerCase().includes("skill")
      );

      console.log(
        `\n✅ Skill queries found: ${
          skillQueries.map((f) => f.name).join(", ") || "none"
        }`
      );
      console.log(
        `✅ Skill mutations found: ${
          skillMutations.map((f) => f.name).join(", ") || "none"
        }`
      );

      const hasSkillOps = skillQueries.length > 0 || skillMutations.length > 0;
      console.log(
        `\n${hasSkillOps ? "✅ SUCCESS" : "❌ FAILED"}: Skill operations ${
          hasSkillOps ? "found" : "not found"
        }`
      );
      process.exit(hasSkillOps ? 0 : 1);
    });
  });

  req.on("error", (e) => {
    if (retries > 0) {
      console.log(`⏳ Waiting for server... (${retries} retries left)`);
      setTimeout(() => attemptRequest(retries - 1, delay), delay);
    } else {
      console.error(`❌ Failed to connect to GraphQL server: ${e.message}`);
      process.exit(1);
    }
  });

  req.write(postData);
  req.end();
};

attemptRequest();
