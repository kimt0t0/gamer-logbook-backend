import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UUID } from 'crypto';
import { Role } from 'src/decorators/roles.decorators';
import { Roles } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateLogbookDto } from './dto/create-logbook.dto';
import { UpdateLogbookDto } from './dto/update-logbook.dto';
import { LogbooksService } from './logbooks.service';

@Controller('logbooks')
export class LogbooksController {
    constructor(private readonly logbooksService: LogbooksService) {}

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createLogbookDto: CreateLogbookDto) {
        return this.logbooksService.create(createLogbookDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Role(Roles.ADMIN)
    @Get()
    findAll() {
        return this.logbooksService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: UUID) {
        return this.logbooksService.findOne(id);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    update(@Param('id') id: UUID, @Body() updateLogbookDto: UpdateLogbookDto) {
        return this.logbooksService.update(id, updateLogbookDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(@Param('id') id: UUID) {
        return this.logbooksService.remove(id);
    }
}
