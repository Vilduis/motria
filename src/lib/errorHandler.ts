import axios from "axios"

interface ApiErrorResponse {
    message?: string
    error?: string
    detail?: string
}

export function getErrorMessage(
    error: unknown,
    defaultMessage = "Ha ocurrido un error inesperado"
): string {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const data = error.response?.data

        return (
            data?.detail ||
            data?.message ||
            data?.error ||
            error.message ||
            defaultMessage
        )
    }

    if (error instanceof Error) return error.message
    if (typeof error === "string") return error

    return defaultMessage
}