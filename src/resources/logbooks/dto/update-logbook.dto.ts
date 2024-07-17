import { IsJSON, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class UpdateLogbookDto {
    @IsString()
    title: string;

    @IsJSON()
    contents: any;

    @IsUUID()
    userId: UUID;

    @IsUUID()
    gameId: UUID;

    @IsString()
    gameTitle: string;
}
