import { externalApiService } from "../services/externalApiService"
import { logger } from "../utils/logger"

async function validateApiConnection() {
  try {
    logger.info("Validating external API connection...")

    // Check if API key is valid
    const isKeyValid = await externalApiService.validateApiKey()
    if (!isKeyValid) {
      logger.error("API key validation failed")
      process.exit(1)
    }

    logger.info("API key validation successful")

    // Check API health
    const isHealthy = await externalApiService.healthCheck()
    if (!isHealthy) {
      logger.warn("External API health check failed - API may be unavailable")
    } else {
      logger.info("External API health check successful")
    }

    logger.info("External API connection validation completed")
  } catch (error) {
    logger.error("Failed to validate external API connection:", error)
    process.exit(1)
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateApiConnection()
}

export { validateApiConnection }
