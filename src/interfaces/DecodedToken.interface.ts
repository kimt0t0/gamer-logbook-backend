import { Roles } from 'src/enums/roles.enum';

export interface DecodedToken {
    id: string;
    username: string;
    role: Roles;
}
