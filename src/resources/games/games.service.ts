/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
    ) {}

    async create(createGameDto: CreateGameDto): Promise<Game> {
        return await this.gameRepository.save(createGameDto);
    }

    async findAll(): Promise<Game[]> {
        return await this.gameRepository.find();
    }

    async findOneById(id: UUID): Promise<Game> {
        return await this.gameRepository.findOneByOrFail({ id });
    }

    async findOneByTitle(title: string): Promise<Game> {
        return await this.gameRepository.findOneByOrFail({ title });
    }

    async update(id: UUID, updateGameDto: UpdateGameDto): Promise<Game> {
        await this.gameRepository.update(id, updateGameDto);
        return this.findOneById(id);
    }

    async remove(id: UUID): Promise<UUID> {
        try {
            await this.gameRepository.delete(id);
            return id;
        } catch {
            throw new NotFoundException(`Game with id ${id} could not be deleted.`);
        }
    }
}
