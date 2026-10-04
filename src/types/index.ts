// ─────────────────────────────────────────────
//  ENUMS
// ─────────────────────────────────────────────
export type OrderStatus = "PENDIENTE" | "EN_PROCESO" | "TERMINADO"
export type UserRole = "ADMIN" | "TECHNICAL"

// ─────────────────────────────────────────────
//  AUTH
// ─────────────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  jwtToken: string
  userId: number
  authorities: string // "ADMIN" o "TECHNICAL" (separados por ";" si hay varios)
  workshopId: number
  workshopName: string
  mustChangePassword: boolean
}

export interface RegisterWorkshopRequest {
  workshopName: string
  ownerName: string
  email: string
  password: string
  phone?: string
  address?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

/** GET /auth/me → DTOMe en backend */
export interface MeResponse {
  userId: number
  email: string
  displayName: string
  authorities: string
  active: boolean
  mustChangePassword: boolean
  workshopId: number
  workshopName: string
}

// ─────────────────────────────────────────────
//  WORKSHOP
// ─────────────────────────────────────────────
export interface Workshop {
  id: number
  workshopName: string
  ownerName: string
  email: string
  phone?: string
  address?: string
  plan?: string
  active?: boolean
}

export interface UpdateWorkshopRequest {
  workshopName: string
  ownerName: string
  phone?: string
  address?: string
}

// ─────────────────────────────────────────────
//  USER
// ─────────────────────────────────────────────
export interface User {
  id: number
  email: string
  active: boolean
  authorities?: string // "ADMIN" o "TECHNICAL" (separados por ";" si hay varios)
}

export interface DTOUser {
  id?: number
  email: string
  password: string
  active?: boolean
  authorities: string // "ADMIN" o "TECHNICAL"
}

// ─────────────────────────────────────────────
//  CUSTOMER
// ─────────────────────────────────────────────
export interface Customer {
  id: number
  name: string
  lastName: string
  phone: string
  email: string
  createdAt?: string // ISO 8601 — añadido en backend
}

export interface DTOCustomer {
  id?: number
  name: string
  lastName: string
  phone: string
  email: string
}

// ─────────────────────────────────────────────
//  TECHNICAL
// ─────────────────────────────────────────────
export interface Technical {
  id: number
  name: string
  lastName: string
  specialty: string
  user?: User
}

export interface DTOTechnical {
  id?: number
  name: string
  lastName: string
  specialty: string
  userId?: number // FK al User del sistema (solo en respuestas / update)
}

/** POST /api/technicals — el backend crea el User TECHNICAL y envía contraseña temporal por email. */
export interface DTOCreateTechnical {
  name: string
  lastName: string
  specialty: string
  email: string
}

// ─────────────────────────────────────────────
//  VEHICLES
// ─────────────────────────────────────────────
export interface Vehicle {
  id: number
  plate: string
  brand: string
  model: string
  year: number
  customer?: Customer
  createdAt?: string // ISO 8601 — añadido en backend
}

export interface DTOVehicle {
  id?: number
  plate: string
  brand: string
  model: string
  year: number
  customerId: number // FK al Customer
}

// ─────────────────────────────────────────────
//  SERVICE ORDERS
// ─────────────────────────────────────────────
export interface ServiceOrder {
  id: number
  date: string // ISO 8601 → "2026-04-11T10:30:00"
  vehicle?: Vehicle
  customer?: Customer
  technical?: Technical
  diagnosis: string
  status: OrderStatus
}

export interface DTOServiceOrder {
  id?: number
  date?: string
  vehicleId: number // FK al Vehicle
  customerId: number // FK al Customer
  technicalId: number // FK al Technical
  diagnosis: string
  status?: OrderStatus
}

// ─────────────────────────────────────────────
//  DASHBOARD — compartido
// ─────────────────────────────────────────────

/** Representa una orden reciente en el panel (GET /api/dashboard/admin o /tecnico/{id}) */
export interface RecentOrder {
  orderId: number
  vehiclePlate: string
  vehicleBrand: string
  vehicleModel: string
  customerName: string
  technicalName: string
  diagnosis: string
  status: OrderStatus
  date: string // ISO 8601
}

// ─────────────────────────────────────────────
//  DASHBOARD — ADMIN  →  GET /api/dashboard/admin
// ─────────────────────────────────────────────
export interface DashboardAdmin {
  totalVehicles: number
  newVehiclesThisWeek: number

  totalCustomers: number
  newCustomersThisWeek: number

  ordersToday: number
  completedToday: number

  pendingOrders: number // PENDIENTE
  inProcessOrders: number // EN_PROCESO  →  bahías ocupadas
  completedOrders: number // TERMINADO

  recentOrders: RecentOrder[]
}

// ─────────────────────────────────────────────
//  DASHBOARD — TÉCNICO  →  GET /api/dashboard/tecnico/{technicalId}
// ─────────────────────────────────────────────
export interface DashboardTecnico {
  totalMyOrders: number
  myPendingOrders: number // PENDIENTE
  myInProcessOrders: number // EN_PROCESO
  myCompletedOrders: number // TERMINADO

  myRecentOrders: RecentOrder[]
}
