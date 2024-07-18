import { IsJSON, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { UUID } from 'crypto';

export class CreateLogbookDto {
    @IsString()
    @Length(3, 50)
    title: string;

    @IsJSON()
    @IsOptional()
    contents?: any;

    @IsUUID()
    ownerId: UUID;

    @IsUUID()
    @IsOptional()
    gameId?: UUID;

    @IsString()
    @IsOptional()
    gameTitle?: string;
}
