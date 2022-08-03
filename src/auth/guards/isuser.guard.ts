import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { User } from "src/user/model/user.interface";
import { UserService } from "src/user/services/user.service";

@Injectable()
export class IsUser implements CanActivate {

    constructor(
        @Inject(forwardRef(() => UserService))
        private userservice: UserService
    ) { }

    canActivate(context: ExecutionContext): boolean | Observable<boolean> | Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const params = request.params
        const user: User = request.user.user

        return this.userservice.findOne(user.id).pipe(
            map((user: User) => {
                let haspermission = false
                if (user.id === +params.id) {
                    haspermission = true
                }
                return user && haspermission
            })
        )
        return true
    }
}