/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { UpdateLogbookDto } from './dto/update-logbook.dto';
import { Logbook } from './entities/logbook.entity';

@Injectable()
export class LogbooksService {
    constructor(
        @InjectRepository(Logbook)
        private logbookRepository: Repository<Logbook>,
    ) {}

    async create(createLogbookDto: CreateLogbookDto): Promise<Logbook> {
        return await this.logbookRepository.save(createLogbookDto);
    }

    async findAll(): Promise<Logbook[]> {
        return await this.logbookRepository.find();
    }

    async findOne(id: UUID): Promise<Logbook> {
        return await this.logbookRepository.findOneByOrFail({ id });
    }

    async update(id: UUID, updateLogbookDto: UpdateLogbookDto): Promise<Logbook> {
        await this.logbookRepository.update(id, updateLogbookDto);
        return this.findOne(id);
    }

    async remove(id: UUID): Promise<UUID> {
        try {
            await this.logbookRepository.delete(id);
            return id;
        } catch (e) {
            throw new NotFoundException(`Logbook with id ${id} could not be deleted: ${e.message}`);
        }
    }
}
