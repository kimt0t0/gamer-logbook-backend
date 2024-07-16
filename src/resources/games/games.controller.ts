/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UUID } from 'crypto';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    @Post()
    create(@Body() createGameDto: CreateGameDto) {
        return this.gamesService.create(createGameDto);
    }

    @Get()
    findAll() {
        return this.gamesService.findAll();
    }

    @Get(':id')
    findOneById(@Param('id') id: UUID) {
        return this.gamesService.findOneById(id);
    }

    @Get('/title/:title')
    findOneByTitle(@Param('title') title: string) {
        return this.gamesService.findOneByTitle(title);
    }

    @Patch(':id')
    update(@Param('id') id: UUID, @Body() updateGameDto: UpdateGameDto) {
        return this.gamesService.update(id, updateGameDto);
    }

    @Delete(':id')
    remove(@Param('id') id: UUID) {
        return this.gamesService.remove(id);
    }
}
