import { Module } from '@nestjs/common';
// import { UserService } from './user/user.service';
import { UserService } from './services/user.service';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({

    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        AuthModule
    ],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule { }
