import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserService } from "src/user/services/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => UserService))
        private userservice: UserService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        console.log(roles)
        if (roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        console.log(request.user)
        const user = request.user;
    }
}