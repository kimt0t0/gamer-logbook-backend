/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() createGameDto: CreateGameDto, @UploadedFile() file: Express.Multer.File) {
        const imageUrl = file ? `/public/uploads/${file.filename}` : null;
        return this.gamesService.create(createGameDto, imageUrl);
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
    @UseInterceptors(FileInterceptor('image'))
    update(@Param('id') id: UUID, @Body() updateGameDto: UpdateGameDto, @UploadedFile() file: Express.Multer.File) {
        const imageUrl = file ? `/public/uploads/${file.filename}` : null;
        return this.gamesService.update(id, updateGameDto, imageUrl);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Role(Roles.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: UUID) {
        return this.gamesService.remove(id);
    }
}
