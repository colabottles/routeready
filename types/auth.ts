export interface AuthClient {
  signUp: {
    email: (data: {
      email: string
      password: string
      name: string
    }) => Promise<AuthResult>
  }
  signIn: {
    email: (data: {
      email: string
      password: string
    }) => Promise<AuthResult>
    social: unknown
  }
  signOut: () => Promise<unknown>
  getSession: () => Promise<SessionResult>
  forgetPassword: (
    data: { email: string; redirectTo: string },
    options?: {
      onSuccess?: () => void
      onError?: (context: { error: { message: string } }) => void
    }
  ) => Promise<unknown>
}

export interface AuthResult {
  data?: {
    user: User
    session: Session
  }
  error?: {
    message: string
    status: number
  }
}

export interface SessionResult {
  data?: {
    user: User
    session: Session
  } | null
}

export interface User {
  id: string
  email: string
  name: string
  emailVerified: boolean
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
  token: string
  ipAddress?: string
  userAgent?: string
}