/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Roles } from 'src/enums/roles.enum';
import { DecodedToken } from 'src/interfaces/DecodedToken.interface';
import { deleteFile } from 'src/utils/file.utils';
import { decodeToken, isolateToken } from 'src/utils/token.utils';
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
        const { title } = createGameDto;
        const userAuthToken = isolateToken(this.request.rawHeaders);
        const userId = decodeToken(userAuthToken).id;
        const owner = await this.usersRepository.findOne({
            where: { id: userId },
        });
        if (!owner) {
            throw new NotFoundException(`User with id ${userId} was not found.`);
        }
        const game = this.gamesRepository.create({
            title,
            owner,
            imageUrl,
        });
        const newGame = await this.gamesRepository.save(game);
        return this.findOneById(newGame.id);
    }

    async findAll(): Promise<Game[]> {
        return await this.gamesRepository.find();
    }

    async findOneById(id: UUID): Promise<Game> {
        const game = await this.gamesRepository
            .createQueryBuilder('game')
            .leftJoinAndSelect('game.owner', 'user')
            .select(['game', 'user.id', 'user.username', 'user.role'])
            .where('game.id = :id', { id })
            .getOne();
        if (!game) {
            throw new NotFoundException(`Game with id ${id} was not found.`);
        }
        return game;
    }

    async findOneByTitle(title: string): Promise<Game> {
        const game = await this.gamesRepository
            .createQueryBuilder('game')
            .leftJoinAndSelect('game.owner', 'user')
            .select(['game', 'user.id', 'user.username', 'user.role'])
            .where('game.title = :title', { title })
            .getOne();
        if (!game) {
            throw new NotFoundException(`Game with title ${title} was not found.`);
        }
        return game;
    }

    async update(id: UUID, updateGameDto: UpdateGameDto, imageUrl: string): Promise<Game> {
        try {
            // Check user
            const userAuthToken = isolateToken(this.request.rawHeaders);
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
                deleteFile(__dirname, game.imageUrl);
                game.imageUrl = null;
            }
            // (replace image)
            if (imageUrl) {
                if (game.imageUrl) deleteFile(__dirname, game.imageUrl);
                game.imageUrl = imageUrl;
            }
            // (game itself)
            Object.assign(game, updateGameDto);
            await this.gamesRepository.save(game);
            return this.findOneById(id);
        } catch (e) {
            throw new Error(`Game with id ${id} could not be updated: ${e.message}`);
        }
    }

    async remove(id: UUID): Promise<UUID> {
        try {
            // Check user
            const userAuthToken = isolateToken(this.request.rawHeaders);
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
            if (game.imageUrl) deleteFile(__dirname, game.imageUrl);
            // Remove game
            await this.gamesRepository.delete(id);
            return id;
        } catch (e) {
            throw new Error(`Game with id ${id} could not be deleted : ${e.message}`);
        }
    }
}
