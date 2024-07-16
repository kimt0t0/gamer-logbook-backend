import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { UpdateLogbookDto } from './dto/update-logbook.dto';
import { LogbooksService } from './logbooks.service';

@Controller('logbooks')
export class LogbooksController {
    constructor(private readonly logbooksService: LogbooksService) {}

    @Post()
    create(@Body() createLogbookDto: CreateLogbookDto) {
        return this.logbooksService.create(createLogbookDto);
    }

    @Get()
    findAll() {
        return this.logbooksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: UUID) {
        return this.logbooksService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: UUID, @Body() updateLogbookDto: UpdateLogbookDto) {
        return this.logbooksService.update(id, updateLogbookDto);
    }

    @Delete(':id')
    remove(@Param('id') id: UUID) {
        return this.logbooksService.remove(id);
    }
}
