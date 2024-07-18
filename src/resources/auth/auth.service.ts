import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async login(loginDto: LoginDto): Promise<{ access_token: string }> {
        const { email, password } = loginDto;
        if (!email) throw new NotAcceptableException(`User must enter an email to login.`);
        if (!password) throw new NotAcceptableException(`User must enter a password to login.`);

        try {
            const user: { id: UUID; username: string; email: string; role: string; hash: string } = await this.userRepository.findOne({
                where: { email },
                select: ['id', 'username', 'email', 'role', 'hash'],
            });
            if (!user) {
                throw new NotFoundException(`No user was found with provided email: ${email}.`);
            }
            const isMatch: boolean = await bcrypt.compare(password, user.hash);
            if (!isMatch) throw new UnauthorizedException(`Password does not match user's password in the database.`);
            const payload = { id: user.id, username: user.username, role: user.role };
            return {
                access_token: await this.jwtService.signAsync(payload),
            };
        } catch (e) {
            throw new Error(`Could not login due to error with code ${e.code}: ${e.message}.`);
        }
    }
}
