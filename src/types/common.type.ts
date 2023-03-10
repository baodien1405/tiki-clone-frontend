import { ReactNode } from 'react'

export interface CheckboxOption {
  label?: ReactNode
  value: string | number
}

export interface SuccessResponse<Data> {
  status: string
  message: string
  data: Data
}
export interface ErrorResponse {
  status: string
  message: string
}

export interface TokenDecode {
  id: string
  isAdmin: boolean
  exp: number
  iat: number
}
