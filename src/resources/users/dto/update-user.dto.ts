import { IsEmail, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}
