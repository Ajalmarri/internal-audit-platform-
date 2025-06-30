import { externalApiService } from "./externalApiService"
import type { Widget } from "../types/external"
import { logger } from "../utils/logger"
import { AppError } from "../utils/errors"

class WidgetApiService {
  /**
   * Fetches a list of widgets from the external API.
   * @param limit - The number of widgets to retrieve.
   * @param offset - The starting point for fetching widgets.
   * @returns A promise that resolves to an array of Widgets.
   */
  async getWidgets(limit = 10, offset = 0): Promise<Widget[]> {
    logger.info(`Fetching widgets with limit: ${limit}, offset: ${offset}`)
    const response = await externalApiService.get<Widget[]>("/widgets", { limit, offset })

    if (!response.success || !response.data) {
      logger.error("Failed to fetch widgets from external API", { error: response.error })
      throw new AppError(response.error || "Could not retrieve widgets.", 502) // 502 Bad Gateway
    }

    return response.data
  }

  /**
   * Fetches a single widget by its ID from the external API.
   * @param id - The ID of the widget to retrieve.
   * @returns A promise that resolves to a Widget or null if not found.
   */
  async getWidgetById(id: string): Promise<Widget | null> {
    logger.info(`Fetching widget with id: ${id}`)
    const response = await externalApiService.get<Widget>(`/widgets/${id}`)

    if (!response.success || !response.data) {
      // Specifically handle 404 Not Found from the external API
      if (response.error?.includes("404") || response.error?.includes("not found")) {
        logger.warn(`Widget with id ${id} not found in external API.`)
        return null
      }
      logger.error(`Failed to fetch widget ${id} from external API`, { error: response.error })
      throw new AppError(response.error || `Could not retrieve widget ${id}.`, 502)
    }

    return response.data
  }
}

export const widgetApiService = new WidgetApiService()
