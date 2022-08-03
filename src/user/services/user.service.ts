import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, Observable, switchMap, throwError, map, pipe } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../model/user.entity';
import { User } from '../model/user.interface';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authservice: AuthService
    ) { }

    create(user: User): Observable<User> {
        return this.authservice.hashpassword(user.password).pipe(
            switchMap((_password: string) => {
                const newuser = new UserEntity()
                newuser.name = user.name
                newuser.username = user.username
                newuser.email = user.email
                newuser.password = _password
                newuser.role = user.role
                return from(this.userRepository.save(newuser)).pipe(
                    map((user: User) => {
                        const { password, ...result } = user
                        return result
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authservice.generateToken(user).pipe(
                        map((jwt: string) => jwt)
                    )
                } else {
                    return 'incorrect username or password'
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByMail(email).pipe(
            switchMap((user: User) =>
                this.authservice.comparePassword(password, user.password).pipe(
                    map((match: boolean) => {
                        if (match) {
                            const { password, ...result } = user
                            return result
                        } else {
                            throw Error
                        }
                    })
                )
            )
        )
    }

    findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOne({
            where: {
                email: email
            }
        }))
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne({
            where: {
                id: id
            }
        })).pipe(
            map((user: User) => {
                const { password, ...result } = user
                return result
            })
        )
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find({relations:['blog']}))
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id))
    }

    updateOne(id: number, user: User): Observable<any> {
        delete user.password
        delete user.role
        return from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.findOne(id))
        )
    }

    updateRole(id: number, user: User): Observable<any> {
        return from(this.userRepository.update(id, user))
    }
}

