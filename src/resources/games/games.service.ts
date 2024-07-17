/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Game)
        private gamesRepository: Repository<Game>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(createGameDto: CreateGameDto): Promise<Game> {
        const { title, imageUrl, userId } = createGameDto;
        const owner = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!owner) {
            throw new NotFoundException(`User with id ${createGameDto.userId} was not found.`);
        }
        const game = this.gamesRepository.create({
            title,
            imageUrl,
            owner,
        });
        return this.gamesRepository.save(game);
    }

    async findAll(): Promise<Game[]> {
        return await this.gamesRepository.find({ relations: ['owner', 'logbooks'] });
    }

    async findOneById(id: UUID): Promise<Game> {
        const game = await this.gamesRepository.findOne({
            where: { id },
            relations: ['owner', 'logbooks'],
        });
        if (!game) {
            throw new NotFoundException(`Game with id ${id} was not found.`);
        }
        return game;
    }

    async findOneByTitle(title: string): Promise<Game> {
        const game = await this.gamesRepository.findOne({
            where: { title },
            relations: ['owner', 'logbooks'],
        });
        if (!game) {
            throw new NotFoundException(`Game with title ${title} was not found.`);
        }
        return game;
    }

    async update(id: UUID, updateGameDto: UpdateGameDto): Promise<Game> {
        await this.gamesRepository.update(id, updateGameDto);
        return this.findOneById(id);
    }

    async remove(id: UUID): Promise<UUID> {
        try {
            await this.gamesRepository.delete(id);
            return id;
        } catch (e) {
            throw new NotFoundException(`Game with id ${id} could not be deleted: ${e.message}`);
        }
    }
}
