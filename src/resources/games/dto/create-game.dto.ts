/* eslint-disable prettier/prettier */
import { IsString, IsUUID, Length } from 'class-validator';
import { UUID } from 'crypto';

export class CreateGameDto {
    @IsString()
    @Length(3, 50)
    title: string;

    @IsUUID()
    userId: UUID;
}
