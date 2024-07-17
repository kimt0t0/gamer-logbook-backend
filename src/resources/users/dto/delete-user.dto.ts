import { IsEmail, IsStrongPassword } from 'class-validator';

export class DeleteUserDto {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;
}
