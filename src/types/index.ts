// ─────────────────────────────────────────────
//  ENUMS
// ─────────────────────────────────────────────
export type OrderStatus = 'PENDIENTE' | 'EN_PROCESO' | 'TERMINADO';
export type UserRole = 'ADMIN' | 'TECNICO';

// ─────────────────────────────────────────────
//  AUTH
// ─────────────────────────────────────────────
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    jwtToken: string;
    userId: number;
    authorities: string; // "ADMIN" o "TECNICO"
}

// ─────────────────────────────────────────────
//  USER
// ─────────────────────────────────────────────
export interface Authority {
    id: number;
    name: UserRole;
}

export interface User {
    id: number;
    email: string;
    active: boolean;
    authorities?: string; // "ADMIN" o "TECNICO" (separados por ";" si hay varios)
}

export interface DTOUser {
    id?: number;
    email: string;
    password: string;
    active?: boolean;
    authorities: string; // "ADMIN" o "TECNICO"
}

// ─────────────────────────────────────────────
//  CUSTOMER
// ─────────────────────────────────────────────
export interface Customer {
    id: number;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    createdAt?: string; // ISO 8601 — añadido en backend
}

export interface DTOCustomer {
    id?: number;
    name: string;
    lastName: string;
    phone: string;
    email: string;
}

// ─────────────────────────────────────────────
//  TECHNICAL
// ─────────────────────────────────────────────
export interface Technical {
    id: number;
    name: string;
    lastName: string;
    specialty: string;
    user?: User;
}

export interface DTOTechnical {
    id?: number;
    name: string;
    lastName: string;
    specialty: string;
    userId: number; // FK al User del sistema
}

// ─────────────────────────────────────────────
//  VEHICLES
// ─────────────────────────────────────────────
export interface Vehicle {
    id: number;
    plate: string;
    brand: string;
    model: string;
    year: number;
    customer?: Customer;
    createdAt?: string; // ISO 8601 — añadido en backend
}

export interface DTOVehicle {
    id?: number;
    plate: string;
    brand: string;
    model: string;
    year: number;
    customerId: number; // FK al Customer
}

// ─────────────────────────────────────────────
//  SERVICE ORDERS
// ─────────────────────────────────────────────
export interface ServiceOrder {
    id: number;
    date: string;           // ISO 8601 → "2026-04-11T10:30:00"
    vehicle?: Vehicle;
    customer?: Customer;
    technical?: Technical;
    diagnosis: string;
    status: OrderStatus;
}

export interface DTOServiceOrder {
    id?: number;
    date?: string;
    vehicleId: number;      // FK al Vehicle
    customerId: number;     // FK al Customer
    technicalId: number;    // FK al Technical
    diagnosis: string;
    status?: OrderStatus;
}

// ─────────────────────────────────────────────
//  DASHBOARD — compartido
// ─────────────────────────────────────────────

/** Representa una orden reciente en el panel (GET /api/dashboard/admin o /tecnico/{id}) */
export interface RecentOrder {
    orderId: number;
    vehiclePlate: string;
    vehicleBrand: string;
    vehicleModel: string;
    customerName: string;
    technicalName: string;
    diagnosis: string;
    status: OrderStatus;
    date: string; // ISO 8601
}

// ─────────────────────────────────────────────
//  DASHBOARD — ADMIN  →  GET /api/dashboard/admin
// ─────────────────────────────────────────────
export interface DashboardAdmin {
    // Tarjeta: Vehículos
    totalVehicles: number;
    newVehiclesThisWeek: number;

    // Tarjeta: Clientes
    totalCustomers: number;
    newCustomersThisWeek: number;

    // Tarjeta: Órdenes Hoy
    ordersToday: number;
    completedToday: number;

    // Estado del Taller
    pendingOrders: number;      // PENDIENTE
    inProcessOrders: number;    // EN_PROCESO  →  bahías ocupadas
    completedOrders: number;    // TERMINADO

    // Actividad Reciente (últimas 5)
    recentOrders: RecentOrder[];
}

// ─────────────────────────────────────────────
//  DASHBOARD — TÉCNICO  →  GET /api/dashboard/tecnico/{technicalId}
// ─────────────────────────────────────────────
export interface DashboardTecnico {
    totalMyOrders: number;
    myPendingOrders: number;    // PENDIENTE
    myInProcessOrders: number;  // EN_PROCESO
    myCompletedOrders: number;  // TERMINADO

    // Mis últimas 5 órdenes
    myRecentOrders: RecentOrder[];
}
