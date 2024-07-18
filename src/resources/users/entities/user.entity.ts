import { randomUUID, UUID } from 'crypto';
import { Roles } from 'src/enums/roles.enum';
import { Game } from 'src/resources/games/entities/game.entity';
import { Logbook } from 'src/resources/logbooks/entities/logbook.entity';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    hash: string;

    @Column({ default: Roles.CLASSIC })
    role: Roles;

    @OneToMany(() => Logbook, (logbook) => logbook.owner, { eager: false, onDelete: 'CASCADE' })
    logbooks: Logbook[];

    @OneToMany(() => Game, (game) => game.owner, { eager: false })
    games: Game[];

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = randomUUID();
        }
    }
}
