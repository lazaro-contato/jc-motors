export interface AuthUser {
  id: string
  email: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface SignInDTO {
  email: string
  password: string
}

export interface SignUpDTO {
  email: string
  password: string
}
