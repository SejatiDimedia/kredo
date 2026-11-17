export type Role = 'ADMIN' | 'ACCOUNTANT' | 'APPROVER' | 'CONTROLLER' | 'AUDITOR'

export interface EntityRole {
  entityId: number
  entityCode: string
  entityName: string
  role: Role
}

export interface User {
  id: number
  email: string
  fullName: string
  activeEntityId: number
  activeEntityCode: string
  activeEntityName: string
  role: Role
  permissions: string[]
  availableEntities: EntityRole[]
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}
