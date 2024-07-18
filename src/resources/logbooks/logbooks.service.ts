/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Roles } from 'src/enums/roles.enum';
import { DecodedToken } from 'src/interfaces/DecodedToken.interface';
import { decodeToken } from 'src/utils/token.utils';
import { Repository } from 'typeorm';
import { Game } from '../games/entities/game.entity';
import { User } from '../users/entities/user.entity';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { UpdateLogbookDto } from './dto/update-logbook.dto';
import { Logbook } from './entities/logbook.entity';

@Injectable()
export class LogbooksService {
    constructor(
        @Inject(REQUEST)
        private request,
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
        try {
            // Check user
            const userAuthToken = this.request.rawHeaders
                .find((header) => header.startsWith('Bearer'))
                .replace('Bearer', '')
                .replace(' ', '');
            const decodedToken: DecodedToken = decodeToken(userAuthToken);
            const user = await this.usersRepository.findOne({
                where: { id: decodedToken.id },
                select: ['id', 'role'],
            });
            const logbookChecker = await this.logbooksRepository.findOne({
                where: { id: id },
                relations: ['owner'],
                select: ['owner'],
            });
            // Handle exceptions and forbidden actions
            if (!user) {
                throw new NotAcceptableException(
                    `You cannot read a logbook if you don't login with a user account. User with id ${decodedToken.id} could not be found in the database.`,
                );
            } else if (user.id != logbookChecker.owner.id && user.role != Roles.ADMIN) {
                throw new NotAcceptableException(`You cannot read a logbook if you didn't add it to the application except if you are an admin.`);
            }
            // Read logbook
            const logbook = await this.logbooksRepository.findOne({
                where: { id },
                relations: ['owner, game'],
            });
            if (!logbook) {
                throw new NotFoundException(`Logbook with id ${id} was not found.`);
            }
            return logbook;
        } catch (e) {
            throw new Error(`Could not read logbook with id ${id} due to error with code ${e.code}: ${e.message}.`);
        }
    }

    async update(id: UUID, updateLogbookDto: UpdateLogbookDto): Promise<Logbook> {
        const { title, contents, gameId, gameTitle } = updateLogbookDto;
        // Check user
        const userAuthToken = this.request.rawHeaders
            .find((header) => header.startsWith('Bearer'))
            .replace('Bearer', '')
            .replace(' ', '');
        const decodedToken: DecodedToken = decodeToken(userAuthToken);
        const user = await this.usersRepository.findOne({
            where: { id: decodedToken.id },
            select: ['id', 'role'],
        });
        const logbookChecker = await this.logbooksRepository.findOne({
            where: { id: id },
            relations: ['owner'],
            select: ['owner'],
        });
        // Handle exceptions and forbidden actions
        if (!user) {
            throw new NotAcceptableException(
                `You cannot edit a logbook if you don't login with a user account. User with id ${decodedToken.id} could not be found in the database.`,
            );
        } else if (user.id != logbookChecker.owner.id && user.role != Roles.ADMIN) {
            throw new NotAcceptableException(`You cannot edit a logbook if you didn't add it to the application except if you are an admin.`);
        }
        // Check game
        let game: Game | null = null;
        if (gameId) game = await this.gamesRepository.findOne({ where: { id: gameId } });
        if (gameTitle) game = await this.gamesRepository.findOne({ where: { title: gameTitle } });
        if ((gameId || gameTitle) && !game) {
            throw new NotFoundException(`Game with id ${gameId} was not found`);
        }
        // Edit logbook
        await this.logbooksRepository.update(id, {
            title,
            contents,
            game,
        });
        return this.findOne(id);
    }

    async remove(id: UUID): Promise<UUID> {
        try {
            // Check user
            const userAuthToken = this.request.rawHeaders
                .find((header) => header.startsWith('Bearer'))
                .replace('Bearer', '')
                .replace(' ', '');
            const decodedToken: DecodedToken = decodeToken(userAuthToken);
            const user = await this.usersRepository.findOne({
                where: { id: decodedToken.id },
                select: ['id', 'role'],
            });
            const logbookChecker = await this.logbooksRepository.findOne({
                where: { id: id },
                relations: ['owner'],
                select: ['owner'],
            });
            // Handle exceptions and forbidden actions
            if (!user) {
                throw new NotAcceptableException(
                    `You cannot delete a logbook if you don't login with a user account. User with id ${decodedToken.id} could not be found in the database.`,
                );
            } else if (user.id != logbookChecker.owner.id && user.role != Roles.ADMIN) {
                throw new NotAcceptableException(`You cannot delete a logbook if you didn't add it to the application except if you are an admin.`);
            }
            // Delete logbook
            await this.logbooksRepository.delete(id);
            return id;
        } catch (e) {
            throw new NotFoundException(`Logbook with id ${id} could not be deleted: ${e.message}`);
        }
    }
}
