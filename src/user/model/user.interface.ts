import { userRole } from "./user.entity"

export interface User {
    id?: number
    name: string
    username?: string
    email?: string
    password?: string
    role?:userRole
}