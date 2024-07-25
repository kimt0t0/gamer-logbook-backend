import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesGuard } from './guards/roles.guard';
import { AuthModule } from './resources/auth/auth.module';
import { GamesModule } from './resources/games/games.module';
import { LogbooksModule } from './resources/logbooks/logbooks.module';
import { UsersModule } from './resources/users/users.module';

@Module({
    imports: [
        // Base config
        ConfigModule.forRoot({
            envFilePath: '.env.dev',
            isGlobal: true,
            cache: true,
        }),
        // Orm
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        // security
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
            },
        ]),
        // resources
        AuthModule,
        UsersModule,
        LogbooksModule,
        GamesModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {}
