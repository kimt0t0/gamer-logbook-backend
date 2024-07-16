import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './resources/games/games.module';
import { LogbooksModule } from './resources/logbooks/logbooks.module';
import { UsersModule } from './resources/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env.dev',
            isGlobal: true,
            cache: true,
        }),
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
        // resources
        UsersModule,
        LogbooksModule,
        GamesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
