import { IsJSON, IsString } from 'class-validator';

export class CreateLogbookDto {
    @IsString()
    title: string;

    @IsJSON()
    contents: any;
}
