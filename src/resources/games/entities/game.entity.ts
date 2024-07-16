/* eslint-disable prettier/prettier */
import { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('games')
export class Game {
    @PrimaryGeneratedColumn()
    id: UUID;

    @Column()
    title: string;

    @Column()
    imageUrl: string;
}
