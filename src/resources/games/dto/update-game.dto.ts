import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateGameDto {
    @IsString()
    @Length(3, 50)
    @IsOptional()
    title?: string;

    @IsOptional()
    @IsBoolean()
    deleteImage?: boolean;

    @IsString()
    @IsOptional()
    imageUrl?: string;
}
