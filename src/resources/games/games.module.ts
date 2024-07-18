import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersModule } from '../users/users.module';
import { Game } from './entities/game.entity';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Game]),
        UsersModule,
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `${uniquePrefix}-${file.fieldname}${ext}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
                    return cb(new Error(`Only image files with extensions .jpg, .jpeg, .png or .webp are allowed.`), false);
                }
                cb(null, true);
            },
            limits: { fileSize: 2 * 1024 * 1024 }, // limit image size to 2Mo
        }),
    ],
    controllers: [GamesController],
    providers: [GamesService],
    exports: [GamesService, TypeOrmModule],
})
export class GamesModule {}
