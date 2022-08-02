import { SetMetadata } from "@nestjs/common"

export const hasRole = (...hasrole: string[]) =>
    SetMetadata('roles', hasrole)
