import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Auth]),
        UsersModule,
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_TOKEN,
            signOptions: { expiresIn: '7d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService, TypeOrmModule],
})
export class AuthModule {}
