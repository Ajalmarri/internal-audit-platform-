import request from "supertest"
import app from "../app"
import { connectDatabase } from "../config/database"

describe("Authentication Endpoints", () => {
  beforeAll(async () => {
    await connectDatabase()
  })

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "TestPassword123!",
      })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("accessToken")
      expect(response.body).toHaveProperty("user")
      expect(response.body.user).not.toHaveProperty("password")
    })

    it("should reject invalid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty("error")
    })

    it("should validate email format", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "invalid-email",
        password: "TestPassword123!",
      })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty("error", "Validation failed")
    })
  })

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "newuser@example.com",
        password: "TestPassword123!",
        firstName: "John",
        lastName: "Doe",
        role: "viewer",
      })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty("message", "User created successfully")
      expect(response.body).toHaveProperty("user")
    })

    it("should reject weak passwords", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "newuser2@example.com",
        password: "weak",
        firstName: "John",
        lastName: "Doe",
        role: "viewer",
      })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty("error", "Validation failed")
    })
  })
})
