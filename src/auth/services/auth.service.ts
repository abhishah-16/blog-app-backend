import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/model/user.interface';
import { from, Observable, of } from 'rxjs';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(private readonly jwtservice: JwtService) { }

    generateToken(user: User): Observable<string> {
        return from(this.jwtservice.signAsync({ user }))
    }

    hashpassword(password: string): Observable<string> {
        return from(bcrypt.hash(password, 12))
    }

    comparePassword(newpassword: string, passwordhash: string): Observable<any | boolean> {
        return of(bcrypt.compare(newpassword, passwordhash))
    }
}
