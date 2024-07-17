/* eslint-disable prettier/prettier */
import { UUID } from 'crypto';
import { Logbook } from 'src/resources/logbooks/entities/logbook.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('games')
export class Game {
    @PrimaryGeneratedColumn()
    id: UUID;

    @Column()
    title: string;

    @Column()
    imageUrl: string;

    @ManyToOne(() => User, (user) => user.games)
    owner: User;

    @OneToMany(() => Logbook, (logbook) => logbook.game)
    logbooks: Logbook[];
}
