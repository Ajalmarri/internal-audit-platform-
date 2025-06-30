export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: UserRole
  department?: string
  phone?: string
  isActive: boolean
  emailVerified: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export type UserRole = "admin" | "auditor" | "manager" | "viewer"

export interface CreateUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  department?: string
  phone?: string
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  role?: UserRole
  department?: string
  phone?: string
  isActive?: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: Omit<User, "passwordHash">
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}
