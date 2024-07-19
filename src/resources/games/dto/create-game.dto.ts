/* eslint-disable prettier/prettier */
import { IsString, Length } from 'class-validator';

export class CreateGameDto {
    @IsString()
    @Length(3, 50)
    title: string;
}
