const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1"

/**
 * Helper untuk melakukan HTTP Request ke Backend Spring Boot.
 * Otomatis menangani header JSON dan membaca pesan error jika terjadi kegagalan.
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    })

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const message = errorData.message || errorData.error || `Error ${res.status}: ${res.statusText}`
        throw new Error(message)
    }

    return res.json()
}