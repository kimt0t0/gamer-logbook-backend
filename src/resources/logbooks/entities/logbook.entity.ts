import { randomUUID, UUID } from 'crypto';
import { Game } from 'src/resources/games/entities/game.entity';
import { User } from 'src/resources/users/entities/user.entity';
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('logbooks')
export class Logbook {
    @PrimaryGeneratedColumn('uuid')
    id: UUID;

    @Column()
    title: string;

    @Column({ type: 'jsonb', nullable: true })
    contents: any;

    @ManyToOne(() => User, (user) => user.logbooks, { eager: false })
    owner: User;

    @ManyToOne(() => Game, (game) => game.logbooks)
    game: Game;

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = randomUUID();
        }
    }
}
