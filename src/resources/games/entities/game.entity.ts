/* eslint-disable prettier/prettier */
import { randomUUID, UUID } from 'crypto';
import { Logbook } from 'src/resources/logbooks/entities/logbook.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('games')
export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column({ unique: true })
    title: string;

    @Column({ nullable: true, unique: true })
    imageUrl: string;

    @ManyToOne(() => User, (user) => user.games, { eager: false, onDelete: 'CASCADE' })
    owner: User;

    @OneToMany(() => Logbook, (logbook) => logbook.game, { eager: false })
    logbooks: Logbook[];

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = randomUUID();
        }
    }
}
