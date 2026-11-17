// Default ke proxy Vite "/api/v1" untuk menghindari isu CORS & Cookie lintas-port
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1"

// Access token disimpan murni di memori RAM runtime browser (FR-AUTH-01: bukan di localStorage / sessionStorage)
let inMemoryAccessToken: string | null = null

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken
}

// Callback listener saat sesi kadaluarsa / logout
let onUnauthorizedCallback: (() => void) | null = null

export function setOnUnauthorized(callback: () => void) {
  onUnauthorizedCallback = callback
}

/**
 * Helper untuk melakukan HTTP Request ke Backend Spring Boot.
 * - Otomatis menyertakan Header Authorization Bearer token jika tersedia.
 * - Otomatis menyertakan credentials: "include" agar cookie HttpOnly refreshToken terkirim.
 * - Menangani refresh token otomatis jika mendapati 401 Unauthorized.
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith("/api/v1")
    ? endpoint.slice("/api/v1".length)
    : endpoint
  const cleanEndpoint = normalizedEndpoint.startsWith("/") ? normalizedEndpoint : `/${normalizedEndpoint}`

  const isFormData = options?.body instanceof FormData
  const headers = new Headers(options?.headers || {})

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (inMemoryAccessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${inMemoryAccessToken}`)
  }

  const fetchOptions: RequestInit = {
    credentials: "include", // Mengirimkan HttpOnly Cookie refreshToken ke localhost:8080
    ...options,
    headers,
  }

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, fetchOptions)
  } catch {
    throw new Error(
      "Tidak dapat terhubung ke Backend Kredo (port 8080). Pastikan Spring Boot dan Docker PostgreSQL sedang berjalan."
    )
  }

  // Jika token JWT habis (401) dan request bukan menuju endpoint auth login/refresh/logout
  const isAuthEndpoint = cleanEndpoint.startsWith("/auth/")
  if (res.status === 401 && !isAuthEndpoint) {
    // Coba silent refresh token menggunakan cookie HttpOnly
    const refreshed = await attemptSilentRefresh()
    if (refreshed) {
      // Pasang access token baru dan ulangi request awal
      if (inMemoryAccessToken) {
        headers.set("Authorization", `Bearer ${inMemoryAccessToken}`)
      }
      try {
        res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
          ...fetchOptions,
          headers,
        })
      } catch {
        throw new Error("Gagal mengulang request setelah refresh token.")
      }
    } else {
      // Jika refresh gagal, cabut token dan picu redirect login
      inMemoryAccessToken = null
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback()
      }
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    const message = errorData.message || errorData.error || `Error ${res.status}: ${res.statusText}`
    throw new Error(message)
  }

  // Jika respon 204 No Content
  if (res.status === 204) {
    return {} as T
  }

  return res.json()
}

/**
 * Melakukan panggilan silent refresh ke /api/v1/auth/refresh
 */
async function attemptSilentRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      return false
    }

    const data = await res.json()
    if (data.accessToken) {
      setAccessToken(data.accessToken)
      return true
    }
    return false
  } catch {
    return false
  }
}
