import { IsString } from 'class-validator';

export class UpdateGameDto {
    @IsString()
    title: string;

    @IsString()
    imageUrl: string;
}
