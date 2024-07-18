import { BadRequestException, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';
import { Roles } from 'src/enums/roles.enum';
import { DecodedToken } from 'src/interfaces/DecodedToken.interface';
import { decodeToken } from 'src/utils/token.utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @Inject(REQUEST)
        private request,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { username, email, password, role } = createUserDto;
        if (role && role === Roles.ADMIN) {
            throw new NotAcceptableException(`You cannot create an admin account. If you need one please contact the developer.`);
        }
        const hash = await bcrypt.hash(password, 15);
        try {
            const user = await this.usersRepository.create({
                username,
                email,
                hash,
                role,
            });
            return this.usersRepository.save(user);
        } catch (e) {
            throw new BadRequestException(`User creation failed with code ${e.code}: ${e.message}.`);
        }
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOneById(id: UUID): Promise<User> {
        try {
            // Check user
            const userAuthToken = this.request.rawHeaders
                .find((header) => header.startsWith('Bearer'))
                .replace('Bearer', '')
                .replace(' ', '');
            const decodedToken: DecodedToken = decodeToken(userAuthToken);
            const userChecker = await this.usersRepository.findOne({
                where: { id: decodedToken.id },
                select: ['id', 'role'],
            });
            // Handle exceptions and forbidden actions
            if (!userChecker) {
                throw new NotAcceptableException(
                    `You cannot read a user's data if you don't login with a user account. User with id ${decodedToken.id} could not be found in the database.`,
                );
            } else if (userChecker.id != id && userChecker.role != Roles.ADMIN) {
                throw new NotAcceptableException(`You cannot read a user's data if you aren't logged in as this user, except if you are an admin.`);
            }
            // Read user
            return await this.usersRepository.findOne({
                where: { id },
                relations: ['games', 'logbooks'],
                select: ['id', 'username', 'role', 'games', 'logbooks'],
            });
        } catch (e) {
            throw new Error(`Could not find user with id ${id} due to error with code ${e.code}: ${e.message}.`);
        }
    }

    async findOneByUsername(username: string): Promise<User> {
        try {
            // Check user
            const userAuthToken = this.request.rawHeaders
                .find((header) => header.startsWith('Bearer'))
                .replace('Bearer', '')
                .replace(' ', '');
            const decodedToken: DecodedToken = decodeToken(userAuthToken);
            const userChecker = await this.usersRepository.findOne({
                where: { id: decodedToken.id },
                select: ['id', 'role'],
            });
            // Handle exceptions and forbidden actions
            if (!userChecker) {
                throw new NotAcceptableException(
                    `You cannot read a user's data if you don't login with a user account. User with id ${decodedToken.id} could not be found in the database.`,
                );
            } else if (userChecker.id != decodedToken.id && userChecker.role != Roles.ADMIN) {
                throw new NotAcceptableException(`You cannot read a user's data if you aren't logged in as this user, except if you are an admin.`);
            }
            // Read user
            return await this.usersRepository.findOne({
                where: { username },
                relations: ['games', 'logbooks'],
                select: ['id', 'username', 'role', 'games', 'logbooks'],
            });
        } catch (e) {
            throw new Error(`Could not find user with username ${username} due to error with code ${e.code}: ${e.message}.`);
        }
    }

    async update(id: UUID, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            // eslint-disable-next-line prefer-const
            let { email, newEmail, password, newPassword, role } = updateUserDto;
            let hash: string | null;
            // Check user is account owner or admin
            const userAuthToken = this.request.rawHeaders
                .find((header) => header.startsWith('Bearer'))
                .replace('Bearer', '')
                .replace(' ', '');
            const decodedToken: DecodedToken = decodeToken(userAuthToken);
            const userAllowedChecker = await this.usersRepository.findOne({
                where: { id: decodedToken.id },
                select: ['id', 'role'],
            });
            // Handle exceptions and forbidden actions due to not allowed account
            if (!userAllowedChecker) {
                throw new NotAcceptableException(
                    `You cannot update a user's data if you don't login with a user account. User with id ${decodedToken.id} could not be found in the database.`,
                );
            } else if (userAllowedChecker.id != id && userAllowedChecker.role != Roles.ADMIN) {
                throw new NotAcceptableException(`You cannot update a user's data if you aren't logged in as this user, except if you are an admin.`);
            }
            // Check credentials
            const userCredentialsChecker = await this.usersRepository.findOne({
                where: { id: decodedToken.id },
                select: ['email', 'hash'],
            });
            if (userCredentialsChecker.email != email) {
                throw new NotAcceptableException(`The given email ${email} does not correspond to user email in the database.`);
            }
            const isPasswordmatch = await bcrypt.compare(password, userCredentialsChecker.hash);
            if (!isPasswordmatch) {
                throw new NotAcceptableException(`The given password does not correspond to user password in the database.`);
            }
            // Update user
            if (newEmail && newEmail.length >= 7) email = newEmail;
            if (newPassword && newPassword.length >= 8) hash = await bcrypt.hash(newPassword, 15);
            if (role) {
                if (userAllowedChecker.role != Roles.ADMIN) role = Roles.CLASSIC;
            }
            await this.usersRepository.update(id, {
                email,
                hash,
                role,
            });
            return this.findOneById(id);
        } catch (e) {
            throw new Error(`Could not find user with id ${id} due to error with code ${e.code}: ${e.message}.`);
        }
    }

    async remove(id: UUID, deleteUserDto: DeleteUserDto): Promise<UUID> {
        // Check if form is completed (additional to validation pipe)
        const { email, password } = deleteUserDto;
        if (!email) throw new NotAcceptableException(`User must enter their email address to delete their account.`);
        if (!password) throw new NotAcceptableException(`User must enter their password to delete their account.`);
        try {
            // Check user
            const userAuthToken = this.request.rawHeaders
                .find((header) => header.startsWith('Bearer'))
                .replace('Bearer', '')
                .replace(' ', '');
            const decodedToken: DecodedToken = decodeToken(userAuthToken);
            const userChecker = await this.usersRepository.findOne({
                where: { id: decodedToken.id },
                select: ['id', 'role'],
            });
            // Handle exceptions and forbidden actions
            if (!userChecker) {
                throw new NotAcceptableException(
                    `You cannot delete a user's data if you don't login with a user account. User with id ${decodedToken.id} could not be found in the database.`,
                );
            } else if (userChecker.id != id && userChecker.role != Roles.ADMIN) {
                throw new NotAcceptableException(`You cannot delete a user's data if you aren't logged in as this user, except if you are an admin.`);
            }
            // Delete user
            await this.usersRepository.delete(id);
            return id;
        } catch (e) {
            throw new Error(`User with id ${id} could not be deleted due to error with code ${e.code}: ${e.message}`);
        }
    }
}
