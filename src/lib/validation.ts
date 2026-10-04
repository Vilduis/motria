/** Reglas de validación compartidas en formularios. */

/** Quita espacios en blanco; el resto debe ser exactamente 9 dígitos. */
export function normalizePhone(value: string): string {
  return value.replace(/\s+/g, "")
}

/** `true` si el teléfono tiene exactamente 9 dígitos (ignora espacios). */
export function isValidPhone(value: string): boolean {
  return /^\d{9}$/.test(normalizePhone(value))
}

export const PHONE_ERROR = "El teléfono debe tener exactamente 9 dígitos"
