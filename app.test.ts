// app.test.ts
// Import necessary modules and app
import request from "supertest";
import { app } from "./app"; // Assuming your app is in app.js

describe("Express App", () => {
  it('should respond with "Hello, World!" at the root route', async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, World!");
  });

  it("should respond with a 404 status code for a non-existent route", async () => {
    const response = await request(app).get("/nonexistent");
    expect(response.status).toBe(404);
  });
});
