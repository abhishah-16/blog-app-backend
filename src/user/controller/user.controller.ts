import { Body, Controller, Delete, Get, Param, Post, Put, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRole } from 'src/auth/decorators/roles.decorator';
import { jwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { userRole } from '../model/user.entity';
import { User } from '../model/user.interface';
import { UserService } from '../services/user.service';
import { diskStorage } from "multer"
import { v4 as uuid } from "uuid"
import { join } from 'path';
import { IsUser } from 'src/auth/guards/isuser.guard';

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
    findOne(@Param() param): Observable<User> {
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

    @UseGuards(jwtAuthGuard, IsUser)
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

    @UseGuards(jwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/profile',
            filename: (req, file, cb) => {
                const filename: string = uuid() + (file.originalname)
                cb(null, `${filename}`)
            }
        })
    }))
    uploadFile(@UploadedFile() file, @Request() req): Observable<object> {
        const user = req.user.user
        return this.userservice.updateOne(user.id, { profileImage: file.filename }).pipe(
            map((user: User) => ({ profileImage: user.profileImage }))
        )
    }

    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/profile/' + imagename)))
    }
}


