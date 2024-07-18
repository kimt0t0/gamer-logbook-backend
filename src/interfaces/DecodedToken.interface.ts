import { UUID } from 'crypto';
import { Roles } from 'src/enums/roles.enum';

export interface DecodedToken {
    id: UUID;
    username: string;
    role: Roles;
}
