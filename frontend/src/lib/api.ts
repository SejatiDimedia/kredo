const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1"

/**
 * Helper untuk melakukan HTTP Request ke Backend Spring Boot.
 * Otomatis menangani header JSON dan membaca pesan error jika terjadi kegagalan.
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Normalisasi: cegah duplikasi jika pemanggil menyertakan "/api/v1"
    const normalizedEndpoint = endpoint.startsWith("/api/v1")
        ? endpoint.slice("/api/v1".length)
        : endpoint
    const cleanEndpoint = normalizedEndpoint.startsWith("/") ? normalizedEndpoint : `/${normalizedEndpoint}`

    const res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
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