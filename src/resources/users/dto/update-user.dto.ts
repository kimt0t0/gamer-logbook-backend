import { IsEmail, IsEnum, IsStrongPassword } from 'class-validator';
import { Roles } from 'src/enums/roles.enum';

export class UpdateUserDto {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsEnum(Roles)
    role?: Roles;
}
