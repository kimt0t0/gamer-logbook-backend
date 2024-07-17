import { UUID } from 'crypto';
import { Roles } from 'src/enums/roles.enum';
import { Game } from 'src/resources/games/entities/game.entity';
import { Logbook } from 'src/resources/logbooks/entities/logbook.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: UUID;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    hash: string;

    @Column({ default: Roles.CLASSIC })
    role: Roles;

    @OneToMany(() => Logbook, (logbook) => logbook.owner)
    logbooks: Logbook[];

    @OneToMany(() => Game, (game) => game.owner)
    games: Game[];
}
