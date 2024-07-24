import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UUID } from 'crypto';
import { Role } from 'src/decorators/roles.decorators';
import { Roles } from 'src/enums/roles.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Role(Roles.ADMIN)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOneById(@Param('id') id: UUID) {
        return this.usersService.findOneById(id);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOneByUsername(@Param('username') username: string) {
        return this.usersService.findOneByUsername(username);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    update(@Param('id') id: UUID, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(@Param('id') id: UUID, @Body() deleteUserDto: DeleteUserDto) {
        return this.usersService.remove(id, deleteUserDto);
    }
}
