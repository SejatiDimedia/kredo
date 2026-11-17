import * as React from "react"
import { apiFetch, setAccessToken, setOnUnauthorized } from "@/lib/api"
import type { User, Role, LoginCredentials, AuthResponse } from "../types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  switchEntity: (entityId: number) => Promise<void>
  hasPermission: (permission: string) => boolean
  hasRole: (role: Role | Role[]) => boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  // Inisialisasi sesi saat aplikasi pertama kali dimuat (Silent Refresh via HttpOnly Cookie)
  React.useEffect(() => {
    setOnUnauthorized(() => {
      setAccessToken(null)
      setUser(null)
    })

    async function checkSession() {
      try {
        const res = await apiFetch<AuthResponse>("/auth/refresh", { method: "POST" })
        if (res && res.accessToken && res.user) {
          setAccessToken(res.accessToken)
          setUser(res.user)
        }
      } catch {
        // Tidak ada sesi aktif (belum login atau refresh token habis)
        setAccessToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = React.useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const res = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })
      setAccessToken(res.accessToken)
      setUser(res.user)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = React.useCallback(async () => {
    try {
      await apiFetch<void>("/auth/logout", { method: "POST" })
    } catch {
      // Abaikan jika server gagal, tetap bersihkan sisi client
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }, [])

  const switchEntity = React.useCallback(async (entityId: number) => {
    setIsLoading(true)
    try {
      const res = await apiFetch<AuthResponse>("/auth/switch-entity", {
        method: "POST",
        body: JSON.stringify({ entityId }),
      })
      setAccessToken(res.accessToken)
      setUser(res.user)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const hasPermission = React.useCallback(
    (permission: string) => {
      if (!user) return false
      return user.permissions?.includes(permission) ?? false
    },
    [user]
  )

  const hasRole = React.useCallback(
    (roles: Role | Role[]) => {
      if (!user) return false
      const roleList = Array.isArray(roles) ? roles : [roles]
      return roleList.includes(user.role)
    },
    [user]
  )

  const value = React.useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      switchEntity,
      hasPermission,
      hasRole,
    }),
    [user, isLoading, login, logout, switchEntity, hasPermission, hasRole]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam <AuthProvider>")
  }
  return context
}
