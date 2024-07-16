import { UUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: UUID;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;
}
