// quizzes.test.ts
import request from "supertest";
import { app } from "../../server"; // your GraphQL server

describe("Quiz submission and grading flow", () => {
  let userToken: string;

  beforeAll(async () => {
    // Seed test user token
    userToken = "user-jwt-token"; // replace with real test token
  });

  test("User can submit quiz and get graded", async () => {
    const mutation = `
      mutation {
        submitQuiz(
          courseId: "course123",
          answers: [
            { nodeId: "node1", answer: "A" },
            { nodeId: "node2", answer: "B" }
          ]
        ) {
          score
          passed
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .send({ query: mutation })
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.submitQuiz.score).toBeGreaterThanOrEqual(0);
    expect(typeof res.body.data.submitQuiz.passed).toBe("boolean");
  });

  test("Unauthorized user cannot submit quiz", async () => {
    const mutation = `
      mutation {
        submitQuiz(
          courseId: "course123",
          answers: [{ nodeId: "node1", answer: "A" }]
        ) {
          score
          passed
        }
      }
    `;

    const res = await request(app).post("/graphql").send({ query: mutation });

    expect(res.status).toBe(401); // unauthorized
  });
});
