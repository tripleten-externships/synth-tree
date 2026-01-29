// courses.test.ts
import request from "supertest";
import { app } from "../../server"; // path to your GraphQL server

describe("Course CRUD operations", () => {
  let adminToken: string;
  let userToken: string;
  let createdCourseId: string;

  beforeAll(async () => {
    // Seed admin and user tokens
    adminToken = "admin-jwt-token"; // replace with real test token
    userToken = "user-jwt-token"; // replace with real test token
  });

  test("Admin can create a course", async () => {
    const mutation = `
      mutation {
        createCourse(data: { title: "Test Course" }) {
          id
          title
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .send({ query: mutation })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.createCourse.title).toBe("Test Course");

    createdCourseId = res.body.data.createCourse.id;
  });

  test("Admin can update a course", async () => {
    const mutation = `
      mutation {
        updateCourse(id: "${createdCourseId}", data: { title: "Updated Course" }) {
          id
          title
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .send({ query: mutation })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.updateCourse.title).toBe("Updated Course");
  });

  test("Admin can delete a course", async () => {
    const mutation = `
      mutation {
        deleteCourse(id: "${createdCourseId}") {
          id
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .send({ query: mutation })
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.deleteCourse.id).toBe(createdCourseId);
  });

  test("User cannot delete a course", async () => {
    const mutation = `
      mutation {
        deleteCourse(id: "${createdCourseId}") {
          id
        }
      }
    `;

    const res = await request(app)
      .post("/graphql")
      .send({ query: mutation })
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403); // forbidden
  });
});
