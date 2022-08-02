import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRole } from 'src/auth/decorators/roles.decorator';
import { jwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { userRole } from '../model/user.entity';
import { User } from '../model/user.interface';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
    constructor(
        private userservice: UserService
    ) { }

    @Post()
    create(@Body() user: User): Observable<User | object> {
        return this.userservice.create(user).pipe(
            map((user: User) => user),
            catchError((err) => of({ error: err.message }))
        )
    }

    @Post('/login')
    login(@Body() user: User) {
        return this.userservice.login(user).pipe(
            map((jwt: string) => { return { access_token: jwt } })
        )
    }

    @Get(':id')
    findOne(@Param() param) {
        return this.userservice.findOne(param.id)
    }

    @hasRole(userRole.ADMIN)
    @UseGuards(jwtAuthGuard, RolesGuard)
    @Get()
    findall(): Observable<User[]> {
        return this.userservice.findAll()
    }

    @Delete(':id')
    deleteone(@Param('id') id: string) {
        return this.userservice.deleteOne(+id)
    }

    @Put(':id')
    updateone(@Param('id') id: string, @Body() user: User) {
        return this.userservice.updateOne(+id, user)
    }

    @hasRole(userRole.ADMIN)
    @UseGuards(jwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRole(@Param('id') id: string, @Body() user: User): Observable<User> {
        return this.userservice.updateRole(+id, user)
    }
}
