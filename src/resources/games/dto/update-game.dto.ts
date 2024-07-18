import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateGameDto {
    @IsString()
    @Length(3, 50)
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;
}
