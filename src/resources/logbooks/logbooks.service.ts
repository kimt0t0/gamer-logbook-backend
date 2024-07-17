/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { Game } from '../games/entities/game.entity';
import { User } from '../users/entities/user.entity';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { UpdateLogbookDto } from './dto/update-logbook.dto';
import { Logbook } from './entities/logbook.entity';

@Injectable()
export class LogbooksService {
    constructor(
        @InjectRepository(Logbook)
        private logbooksRepository: Repository<Logbook>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Game)
        private gamesRepository: Repository<Game>,
    ) {}

    async create(createLogbookDto: CreateLogbookDto): Promise<Logbook> {
        const { title, contents, ownerId, gameId } = createLogbookDto;
        const owner = await this.usersRepository.findOne({ where: { id: ownerId } });
        if (!owner) {
            throw new NotFoundException(`User with id ${ownerId} was not found.`);
        }
        let game: Game;
        if (gameId && gameId != null) {
            game = await this.gamesRepository.findOne({ where: { id: gameId } });
            if (!game) {
                throw new NotFoundException(`Game with id ${gameId} was not found.`);
            }
        }
        const logbook = this.logbooksRepository.create({
            title,
            contents,
            owner,
            game,
        });
        return await this.logbooksRepository.save(logbook);
    }

    async findAll(): Promise<Logbook[]> {
        return await this.logbooksRepository.find({ relations: ['owner', 'game'] });
    }

    async findOne(id: UUID): Promise<Logbook> {
        const logbook = await this.logbooksRepository.findOne({
            where: { id },
            relations: ['owner, game'],
        });
        if (!logbook) {
            throw new NotFoundException(`Logbook with id ${id} was not found.`);
        }
        return logbook;
    }

    async update(id: UUID, updateLogbookDto: UpdateLogbookDto): Promise<Logbook> {
        const { title, contents, gameId, gameTitle } = updateLogbookDto;
        let game: Game | null = null;
        if (gameId) game = await this.gamesRepository.findOne({ where: { id: gameId } });
        if (gameTitle) game = await this.gamesRepository.findOne({ where: { title: gameTitle } });
        if ((gameId || gameTitle) && !game) {
            throw new NotFoundException(`Game with id ${gameId} was not found`);
        }
        await this.logbooksRepository.update(id, {
            title,
            contents,
            game,
        });
        return this.findOne(id);
    }

    async remove(id: UUID): Promise<UUID> {
        try {
            await this.logbooksRepository.delete(id);
            return id;
        } catch (e) {
            throw new NotFoundException(`Logbook with id ${id} could not be deleted: ${e.message}`);
        }
    }
}
