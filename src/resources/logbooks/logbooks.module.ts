import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from '../games/games.module';
import { UsersModule } from '../users/users.module';
import { Logbook } from './entities/logbook.entity';
import { LogbooksController } from './logbooks.controller';
import { LogbooksService } from './logbooks.service';

@Module({
    imports: [TypeOrmModule.forFeature([Logbook]), UsersModule, GamesModule],
    controllers: [LogbooksController],
    providers: [LogbooksService],
    exports: [LogbooksService, TypeOrmModule],
})
export class LogbooksModule {}
