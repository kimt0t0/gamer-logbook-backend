/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { UUID } from 'crypto';

export class CreateGameDto {
    @IsString()
    @Length(3, 50)
    title: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsUUID()
    userId: UUID;
}
