/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class CreateGameDto {
    @IsString()
    title: string;

    @IsString()
    imageUrl: string;
}
