import { IsEmail, IsEnum, IsOptional, IsStrongPassword, Length } from 'class-validator';
import { Roles } from 'src/enums/roles.enum';

export class UpdateUserDto {
    @IsEmail()
    @Length(3, 150)
    email: string;

    @IsEmail()
    @Length(3, 150)
    @IsOptional()
    newEmail: string;

    @IsStrongPassword()
    @Length(8, 250)
    password: string;

    @IsStrongPassword()
    @Length(8, 250)
    @IsOptional()
    newPassword?: string;

    @IsEnum(Roles)
    @IsOptional()
    role?: Roles;
}
