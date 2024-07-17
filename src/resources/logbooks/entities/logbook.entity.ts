import { UUID } from 'crypto';
import { Game } from 'src/resources/games/entities/game.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('logbooks')
export class Logbook {
    @PrimaryGeneratedColumn()
    id: UUID;

    @Column()
    title: string;

    @Column('jsonb')
    contents: any;

    @ManyToOne(() => User, (user) => user.logbooks)
    owner: User;

    @ManyToOne(() => Game, (game) => game.logbooks)
    game: Game;
}
