import { Router } from "express"
import { body, query, param, validationResult } from "express-validator"
import { UserService } from "../services/userService"
import { requireRole, requirePermission, type AuthenticatedRequest } from "../middleware/auth"
import { AppError } from "../utils/errors"

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

// Get current user profile
router.get("/me", async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await userService.findById(req.user!.id)
    if (!user) {
      throw new AppError("User not found", 404)
    }
    res.json(user)
  } catch (error) {
    next(error)
  }
})

// Update current user profile
router.put(
  "/me",
  [
    body("firstName").optional().trim().isLength({ min: 1, max: 100 }),
    body("lastName").optional().trim().isLength({ min: 1, max: 100 }),
    body("department").optional().trim().isLength({ max: 100 }),
    body("phone").optional().isMobilePhone("any"),
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { firstName, lastName, department, phone } = req.body

      const updatedUser = await userService.update(
        req.user!.id,
        {
          firstName,
          lastName,
          department,
          phone,
        },
        req.user!.id,
      )

      res.json(updatedUser)
    } catch (error) {
      next(error)
    }
  },
)

// Get all users (admin/manager only)
router.get(
  "/",
  requirePermission("user:read"),
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("role").optional().isIn(["admin", "auditor", "manager", "viewer"]),
    query("department").optional().trim(),
    query("isActive").optional().isBoolean(),
    query("search").optional().trim(),
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const page = Number.parseInt(req.query.page as string) || 1
      const limit = Number.parseInt(req.query.limit as string) || 10
      const filters = {
        role: req.query.role,
        department: req.query.department,
        isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
        search: req.query.search,
      }

      const result = await userService.findAll(page, limit, filters)

      res.json({
        users: result.users,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      })
    } catch (error) {
      next(error)
    }
  },
)

// Get user by ID (admin/manager only)
router.get(
  "/:id",
  requirePermission("user:read"),
  [param("id").isInt({ min: 1 })],
  validateRequest,
  async (req, res, next) => {
    try {
      const userId = Number.parseInt(req.params.id)
      const user = await userService.findById(userId)

      if (!user) {
        throw new AppError("User not found", 404)
      }

      res.json(user)
    } catch (error) {
      next(error)
    }
  },
)

// Create new user (admin only)
router.post(
  "/",
  requireRole("admin"),
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
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userData = req.body

      const user = await userService.create(userData, req.user!.id)

      res.status(201).json({
        message: "User created successfully",
        user,
      })
    } catch (error) {
      next(error)
    }
  },
)

// Update user (admin/manager only)
router.put(
  "/:id",
  requirePermission("user:write"),
  [
    param("id").isInt({ min: 1 }),
    body("firstName").optional().trim().isLength({ min: 1, max: 100 }),
    body("lastName").optional().trim().isLength({ min: 1, max: 100 }),
    body("role").optional().isIn(["admin", "auditor", "manager", "viewer"]),
    body("department").optional().trim().isLength({ max: 100 }),
    body("phone").optional().isMobilePhone("any"),
    body("isActive").optional().isBoolean(),
  ],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = Number.parseInt(req.params.id)
      const userData = req.body

      // Prevent non-admin users from changing roles or admin status
      if (req.user!.role !== "admin") {
        delete userData.role
        delete userData.isActive
      }

      const updatedUser = await userService.update(userId, userData, req.user!.id)

      res.json(updatedUser)
    } catch (error) {
      next(error)
    }
  },
)

// Delete user (admin only)
router.delete(
  "/:id",
  requireRole("admin"),
  [param("id").isInt({ min: 1 })],
  validateRequest,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = Number.parseInt(req.params.id)

      // Prevent self-deletion
      if (userId === req.user!.id) {
        throw new AppError("Cannot delete your own account", 400)
      }

      await userService.delete(userId, req.user!.id)

      res.json({ message: "User deleted successfully" })
    } catch (error) {
      next(error)
    }
  },
)

export default router
