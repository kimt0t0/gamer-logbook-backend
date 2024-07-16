import { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('logbooks')
export class Logbook {
    @PrimaryGeneratedColumn()
    id: UUID;

    @Column()
    title: string;

    @Column('jsonb')
    contents: any;
}
