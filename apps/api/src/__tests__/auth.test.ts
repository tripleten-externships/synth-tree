// auth.test.ts
import request from "supertest";
import { app } from "../../server"; // path to your GraphQL server

describe("Authentication and Authorization", () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // Seed test tokens
    adminToken = "admin-jwt-token"; // replace with real test token
    userToken = "user-jwt-token"; // replace with real test token
  });

  test("User can access their own progress", async () => {
    const query = `
      query {
        myProgress {
          id
          nodeId
          completed
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .send({ query })
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.myProgress)).toBe(true);
  });

  test("User cannot access another user's progress", async () => {
    const query = `
      query {
        nodeProgress(nodeId: "otherUserNodeId") {
          id
          nodeId
          completed
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .send({ query })
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.nodeProgress).toBeNull(); // cannot see another user's node
  });

  test("Admin can access any user's progress", async () => {
    const query = `
      query {
        nodeProgress(nodeId: "otherUserNodeId") {
          id
          nodeId
          completed
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .send({ query })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.nodeProgress).not.toBeNull();
  });

  test("Unauthorized request is rejected", async () => {
    const query = `
      query {
        myProgress {
          id
        }
      }
    `;

    const res = await request(app).post("/graphql").send({ query });

    expect(res.status).toBe(401); // unauthorized
  });
});
