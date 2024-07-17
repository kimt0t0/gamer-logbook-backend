import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { Roles } from 'src/enums/roles.enum';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsEnum(Roles)
    role?: Roles;
}
