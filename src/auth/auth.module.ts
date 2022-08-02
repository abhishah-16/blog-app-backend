import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { jwtAuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.statergy';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './services/auth.service';

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async () => ({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '10000s' }
            })
        })
    ],
    providers: [AuthService,RolesGuard,jwtAuthGuard,JwtStrategy],
    exports:[AuthService]
})
export class AuthModule { }
