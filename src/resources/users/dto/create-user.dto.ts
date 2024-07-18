import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword, Length } from 'class-validator';
import { Roles } from 'src/enums/roles.enum';

export class CreateUserDto {
    @IsString()
    @Length(3, 50)
    username: string;

    @IsEmail()
    @Length(3, 150)
    email: string;

    @IsStrongPassword()
    @Length(8, 250)
    password: string;

    @IsEnum(Roles)
    @IsOptional()
    role?: Roles;
}
