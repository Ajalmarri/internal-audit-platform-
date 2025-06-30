import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
import { logger } from "../utils/logger"

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface ApiRequestOptions {
  timeout?: number
  retries?: number
  retryDelay?: number
}

export class ExternalApiService {
  private client: AxiosInstance
  private apiKey: string

  constructor() {
    this.apiKey = process.env.K || ""

    if (!this.apiKey) {
      throw new Error("API Key 'K' is required but not provided in environment variables")
    }

    this.client = axios.create({
      baseURL: "https://api.example.com/v1", // Replace with actual API base URL
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "User-Agent": "Internal-Audit-Platform/1.0",
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.info(`Making API request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        logger.error("API request error:", error)
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        logger.info(`API response received: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        if (error.response) {
          logger.error(`API error response: ${error.response.status} ${error.response.data}`)
        } else if (error.request) {
          logger.error("API request failed - no response received:", error.request)
        } else {
          logger.error("API request setup error:", error.message)
        }
        return Promise.reject(error)
      },
    )
  }

  private async makeRequest<T>(config: AxiosRequestConfig, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const { timeout = 30000, retries = 3, retryDelay = 1000 } = options

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.client.request<T>({
          ...config,
          timeout,
        })

        return {
          success: true,
          data: response.data,
          message: "Request successful",
        }
      } catch (error: any) {
        const isLastAttempt = attempt === retries

        if (error.response) {
          // Server responded with error status
          const statusCode = error.response.status
          const errorMessage = error.response.data?.message || error.response.statusText

          if (statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
            // Client errors (except rate limiting) - don't retry
            return {
              success: false,
              error: `API client error (${statusCode}): ${errorMessage}`,
            }
          }

          if (isLastAttempt) {
            return {
              success: false,
              error: `API server error (${statusCode}): ${errorMessage}`,
            }
          }
        } else if (error.request) {
          // Network error
          if (isLastAttempt) {
            return {
              success: false,
              error: "Network error: Unable to reach API server",
            }
          }
        } else {
          // Request setup error
          return {
            success: false,
            error: `Request configuration error: ${error.message}`,
          }
        }

        // Wait before retry
        if (!isLastAttempt) {
          logger.warn(`API request attempt ${attempt} failed, retrying in ${retryDelay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt))
        }
      }
    }

    return {
      success: false,
      error: "Maximum retry attempts exceeded",
    }
  }

  // Generic GET request
  async get<T>(endpoint: string, params?: Record<string, any>, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      {
        method: "GET",
        url: endpoint,
        params,
      },
      options,
    )
  }

  // Generic POST request
  async post<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      {
        method: "POST",
        url: endpoint,
        data,
      },
      options,
    )
  }

  // Generic PUT request
  async put<T>(endpoint: string, data?: any, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      {
        method: "PUT",
        url: endpoint,
        data,
      },
      options,
    )
  }

  // Generic DELETE request
  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      {
        method: "DELETE",
        url: endpoint,
      },
      options,
    )
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get("/health")
      return response.success
    } catch (error) {
      logger.error("API health check failed:", error)
      return false
    }
  }

  // Method to validate API key
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await this.get("/auth/validate")
      return response.success
    } catch (error) {
      logger.error("API key validation failed:", error)
      return false
    }
  }
}

// Singleton instance
export const externalApiService = new ExternalApiService()
