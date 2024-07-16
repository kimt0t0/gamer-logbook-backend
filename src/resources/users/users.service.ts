import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        return await this.userRepository.create(createUserDto);
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

    async remove(id: UUID): Promise<UUID> {
        try {
            await this.userRepository.delete(id);
            return id;
        } catch (e) {
            throw new NotFoundException(`User with id ${id} could not be deleted: ${e.message}`);
        }
    }
}
