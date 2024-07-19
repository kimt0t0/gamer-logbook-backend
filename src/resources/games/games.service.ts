/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { Roles } from 'src/enums/roles.enum';
import { DecodedToken } from 'src/interfaces/DecodedToken.interface';
import { decodeToken } from 'src/utils/token.utils';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
    constructor(
        @Inject(REQUEST)
        private request,
        @InjectRepository(Game)
        private gamesRepository: Repository<Game>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(createGameDto: CreateGameDto, imageUrl: string): Promise<Game> {
        const { title, userId } = createGameDto;
        const owner = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!owner) {
            throw new NotFoundException(`User with id ${createGameDto.userId} was not found.`);
        }
        const game = this.gamesRepository.create({
            title,
            owner,
            imageUrl,
        });
        return this.gamesRepository.save(game);
    }

    async findAll(): Promise<Game[]> {
        return await this.gamesRepository.find();
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

    async update(id: UUID, updateGameDto: UpdateGameDto, imageUrl: string): Promise<Game> {
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
            const game = await this.findOneById(id);
            if (!game) {
                throw new NotAcceptableException(`Game with id ${id} could not be found.`);
            }
            // Handle exceptions and forbidden actions
            if (!user) {
                throw new NotAcceptableException(
                    `You cannot update a game if you don't login with a user account. User with id ${decodedToken.id} could not be found in the database.`,
                );
            } else if (user.id != game.owner.id && user.role != Roles.ADMIN) {
                throw new NotAcceptableException(`You cannot edit a game if you didn't add it to the application except if you are an admin.`);
            }
            // Update game
            // (delete image)
            if (updateGameDto.deleteImage && game.imageUrl) {
                const filePath = path.join(__dirname, '..', '..', '..', 'uploads', path.basename(game.imageUrl));
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete image file: ${filePath}`, err);
                    }
                });
                game.imageUrl = null;
            }
            // (replace image)
            if (imageUrl) {
                if (game.imageUrl) {
                    const oldFilePath = path.join(__dirname, '..', '..', '..', 'public/uploads', path.basename(game.imageUrl));
                    fs.unlink(oldFilePath, (err) => {
                        if (err) {
                            console.error(`Failed to delete old image file: ${oldFilePath}`, err);
                        }
                    });
                }
                game.imageUrl = imageUrl;
            }
            // (game itself)
            Object.assign(game, updateGameDto);
            return this.gamesRepository.save(game);
        } catch (e) {
            throw new Error(`Game with id ${id} could not be updated due to error with code ${e.code}: ${e.message}`);
        }
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
            const game = await this.findOneById(id);
            // Handle exceptions and forbidden actions
            if (!user) {
                throw new NotAcceptableException(
                    `You cannot delete a game if you don't login with a user account. User with id ${decodedToken.id} could not be found in the database.`,
                );
            } else if (user.id != game.owner.id && user.role != Roles.ADMIN) {
                throw new NotAcceptableException(`You cannot delete a game if you didn't add it to the application except if you are an admin.`);
            }
            // Remove image
            if (game.imageUrl) {
                const filePath = path.join(__dirname, '..', '..', '..', 'uploads', path.basename(game.imageUrl));
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete image file: ${filePath}`, err);
                    }
                });
            }
            // Remove game
            await this.gamesRepository.delete(id);
            return id;
        } catch (e) {
            throw new Error(`Game with id ${id} could not be deleted due to error with code ${e.code}: ${e.message}`);
        }
    }
}
