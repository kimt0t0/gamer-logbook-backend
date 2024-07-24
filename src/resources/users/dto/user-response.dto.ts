import { UUID } from 'crypto';
import { Roles } from 'src/enums/roles.enum';

export class UserResponseDto {
    id: UUID;

    username: string;

    role: Roles;
}
