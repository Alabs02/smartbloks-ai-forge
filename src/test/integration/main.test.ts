import request from "supertest";
import { app, shutdown } from "@/main";
import { SERVER } from "@/config";

describe("SmartBloks AI-Forge Integration Tests", () => {
  afterAll((done) => {
    shutdown(done);
  });

  it("Starts and has the proper test environment", async () => {
    expect(process.env.NODE_ENV).toBe("test");
    expect(app).toBeDefined();
  }, 10000);

  it("should return 200 for health check", async () => {
    const response = await request(app).get("/api/v1/health-check");
    expect(response.status).toBe(200);
  }, 1000);

  it("should return Swagger JSON", async () => {
    const response = await request(app).get(`/api-docs/${SERVER.SERVICE_VERSION}.json`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("openapi", "3.0.0");
  }, 1000);

  it("should return 404 for unknown route", async () => {
    const response = await request(app).get("/api/v1/unknown-route");

    expect(response.status).toBe(404);
  }, 10000);
});
