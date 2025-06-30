import { Router } from "express"
import { authenticateToken, requirePermission } from "../middleware/auth"
import { complianceApiService } from "../services/complianceApiService"
import { riskApiService } from "../services/riskApiService"
import { externalApiService } from "../services/externalApiService"
import { AppError } from "../utils/errors"

const router = Router()

// Apply authentication to all routes
router.use(authenticateToken)

// Health check for external API
router.get("/health", async (req, res, next) => {
  try {
    const isHealthy = await externalApiService.healthCheck()

    res.json({
      success: true,
      data: {
        externalApiHealthy: isHealthy,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    next(error)
  }
})

// Validate API key
router.get("/validate-key", requirePermission("admin"), async (req, res, next) => {
  try {
    const isValid = await externalApiService.validateApiKey()

    res.json({
      success: true,
      data: {
        apiKeyValid: isValid,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    next(error)
  }
})

// Compliance API routes
router.get("/compliance/frameworks", requirePermission("read_compliance"), async (req, res, next) => {
  try {
    const frameworks = await complianceApiService.getComplianceFrameworks()

    res.json({
      success: true,
      data: frameworks,
    })
  } catch (error) {
    next(error)
  }
})

router.get("/compliance/frameworks/:frameworkId", requirePermission("read_compliance"), async (req, res, next) => {
  try {
    const { frameworkId } = req.params
    const framework = await complianceApiService.getComplianceFramework(frameworkId)

    if (!framework) {
      throw new AppError("Compliance framework not found", 404)
    }

    res.json({
      success: true,
      data: framework,
    })
  } catch (error) {
    next(error)
  }
})

router.post("/compliance/assessments", requirePermission("create_compliance"), async (req, res, next) => {
  try {
    const assessment = await complianceApiService.submitComplianceAssessment(req.body)

    res.status(201).json({
      success: true,
      data: assessment,
    })
  } catch (error) {
    next(error)
  }
})

router.get(
  "/compliance/assessments/:organizationId/:frameworkId",
  requirePermission("read_compliance"),
  async (req, res, next) => {
    try {
      const { organizationId, frameworkId } = req.params
      const assessment = await complianceApiService.getComplianceAssessment(organizationId, frameworkId)

      if (!assessment) {
        throw new AppError("Compliance assessment not found", 404)
      }

      res.json({
        success: true,
        data: assessment,
      })
    } catch (error) {
      next(error)
    }
  },
)

router.post("/compliance/validate", requirePermission("create_compliance"), async (req, res, next) => {
  try {
    const validation = await complianceApiService.validateComplianceData(req.body)

    res.json({
      success: true,
      data: validation,
    })
  } catch (error) {
    next(error)
  }
})

// Risk API routes
router.get("/risk/matrix", requirePermission("read_risk"), async (req, res, next) => {
  try {
    const matrix = await riskApiService.getRiskMatrix()

    res.json({
      success: true,
      data: matrix,
    })
  } catch (error) {
    next(error)
  }
})

router.post("/risk/assess", requirePermission("create_risk"), async (req, res, next) => {
  try {
    const assessment = await riskApiService.performRiskAssessment(req.body)

    res.status(201).json({
      success: true,
      data: assessment,
    })
  } catch (error) {
    next(error)
  }
})

router.get("/risk/history/:organizationId", requirePermission("read_risk"), async (req, res, next) => {
  try {
    const { organizationId } = req.params
    const limit = Number.parseInt(req.query.limit as string) || 10

    const history = await riskApiService.getRiskAssessmentHistory(organizationId, limit)

    res.json({
      success: true,
      data: history,
    })
  } catch (error) {
    next(error)
  }
})

router.post("/risk/recommendations", requirePermission("read_risk"), async (req, res, next) => {
  try {
    const { riskFactors } = req.body

    if (!Array.isArray(riskFactors)) {
      throw new AppError("Risk factors must be an array", 400)
    }

    const recommendations = await riskApiService.getRiskRecommendations(riskFactors)

    res.json({
      success: true,
      data: {
        recommendations,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
