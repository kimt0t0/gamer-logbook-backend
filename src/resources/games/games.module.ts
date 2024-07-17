import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Game } from './entities/game.entity';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
    imports: [TypeOrmModule.forFeature([Game]), UsersModule],
    controllers: [GamesController],
    providers: [GamesService],
    exports: [GamesService, TypeOrmModule],
})
export class GamesModule {}
