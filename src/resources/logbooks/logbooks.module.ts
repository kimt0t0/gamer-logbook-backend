import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logbook } from './entities/logbook.entity';
import { LogbooksController } from './logbooks.controller';
import { LogbooksService } from './logbooks.service';

@Module({
    imports: [TypeOrmModule.forFeature([Logbook])],
    controllers: [LogbooksController],
    providers: [LogbooksService],
})
export class LogbooksModule {}
