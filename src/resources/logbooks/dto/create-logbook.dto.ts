import { IsJSON, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateLogbookDto {
    @IsString()
    title: string;

    @IsJSON()
    contents: any;

    @IsUUID()
    ownerId: UUID;

    @IsUUID()
    gameId?: UUID;

    @IsString()
    gameTitle?: string;
}
