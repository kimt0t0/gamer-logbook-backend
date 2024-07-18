import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { UUID } from 'crypto';

export class UpdateLogbookDto {
    @IsString()
    @Length(3, 50)
    @IsOptional()
    title: string;

    // @IsJSON()
    @IsOptional()
    contents?: any;

    @IsUUID()
    @IsOptional()
    gameId?: UUID;

    @IsString()
    @IsOptional()
    gameTitle?: string;
}
