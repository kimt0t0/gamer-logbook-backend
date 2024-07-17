import * as bcrypt from '@bcrypt';
import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Roles } from 'src/enums/roles.enum';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { username, email, password, role } = createUserDto;
        if (role && role === Roles.ADMIN) {
            throw new NotAcceptableException(`You cannot create an admin account. If you need one please contact the developer.`);
        }
        const hash = await bcrypt.hash(password, 15);
        try {
            return await this.userRepository.create({
                username,
                email,
                hash,
                role,
            });
        } catch (e) {
            throw new BadRequestException(`User creation failed with code ${e.code}: ${e.message}.`);
        }
    }
    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOneById(id: UUID): Promise<User> {
        return await this.userRepository.findOneByOrFail({ id });
    }

    async findOneByUsername(username: string): Promise<User> {
        return await this.userRepository.findOneByOrFail({ username });
    }

    async update(id: UUID, updateUserDto: UpdateUserDto): Promise<User> {
        await this.userRepository.update(id, updateUserDto);
        return this.findOneById(id);
    }

    async remove(id: UUID, deleteUserDto: DeleteUserDto): Promise<UUID> {
        const { email, password } = deleteUserDto;
        if (!email) throw new NotAcceptableException(`User must enter their email address to delete their account.`);
        if (!password) throw new NotAcceptableException(`User must enter their password to delete their account.`);
        try {
            await this.userRepository.delete(id);
            return id;
        } catch (e) {
            throw new NotFoundException(`User with id ${id} could not be deleted: ${e.message}`);
        }
    }
}
