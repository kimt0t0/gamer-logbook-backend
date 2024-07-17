/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UUID } from 'crypto';
import { Role } from 'src/decorators/roles.decorators';
import { Roles } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createGameDto: CreateGameDto) {
        return this.gamesService.create(createGameDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    findAll() {
        return this.gamesService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOneById(@Param('id') id: UUID) {
        return this.gamesService.findOneById(id);
    }

    @UseGuards(AuthGuard)
    @Get('/title/:title')
    findOneByTitle(@Param('title') title: string) {
        return this.gamesService.findOneByTitle(title);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    update(@Param('id') id: UUID, @Body() updateGameDto: UpdateGameDto) {
        return this.gamesService.update(id, updateGameDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Role(Roles.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: UUID) {
        return this.gamesService.remove(id);
    }
}
