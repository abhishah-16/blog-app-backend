import { Blog } from "src/blog/models/blog.interface"
import { userRole } from "./user.entity"

export interface User {
    id?: number
    name?: string
    username?: string
    email?: string
    password?: string
    role?: userRole
    profileImage?: string
    blog?: Blog[]
}