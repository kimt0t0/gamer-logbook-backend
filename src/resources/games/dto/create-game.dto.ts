/* eslint-disable prettier/prettier */
import { IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateGameDto {
    @IsString()
    title: string;

    @IsString()
    imageUrl: string;

    @IsUUID()
    userId: UUID;
}
