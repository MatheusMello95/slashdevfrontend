export interface User {
  id: number
  name: string
  email: string
  widget_ids: number[]
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}