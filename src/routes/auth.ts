import { Router } from "express"
import { body, validationResult } from "express-validator"
import { UserService } from "../services/userService"
import { AppError } from "../utils/errors"
import { logger } from "../utils/logger"

const router = Router()
const userService = new UserService()

// Validation middleware
const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    })
  }
  next()
}

// Login endpoint
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").isLength({ min: 6 })],
  validateRequest,
  async (req, res, next) => {
    try {
      const { email, password } = req.body

      const result = await userService.login({ email, password })

      // Set refresh token as httpOnly cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      logger.info(`User logged in: ${email}`)

      res.json({
        user: result.user,
        accessToken: result.accessToken,
      })
    } catch (error) {
      next(error)
    }
  },
)

// Register endpoint
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
    body("firstName").trim().isLength({ min: 1, max: 100 }),
    body("lastName").trim().isLength({ min: 1, max: 100 }),
    body("role").isIn(["admin", "auditor", "manager", "viewer"]),
    body("department").optional().trim().isLength({ max: 100 }),
    body("phone").optional().isMobilePhone("any"),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const userData = req.body

      const user = await userService.create(userData)

      logger.info(`New user registered: ${user.email}`)

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      })
    } catch (error) {
      next(error)
    }
  },
)

// Refresh token endpoint
router.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!refreshToken) {
      throw new AppError("Refresh token required", 401)
    }

    const result = await userService.refreshToken(refreshToken)

    // Set new refresh token as httpOnly cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.json({
      accessToken: result.accessToken,
    })
  } catch (error) {
    next(error)
  }
})

// Logout endpoint
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken")
  res.json({ message: "Logged out successfully" })
})

// Password reset request
router.post("/forgot-password", [body("email").isEmail().normalizeEmail()], validateRequest, async (req, res, next) => {
  try {
    const { email } = req.body

    // TODO: Implement password reset logic
    // 1. Generate reset token
    // 2. Save token to database with expiration
    // 3. Send email with reset link

    res.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    next(error)
  }
})

export default router
