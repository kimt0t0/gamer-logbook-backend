import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from 'src/interfaces/DecodedToken.interface';

export const decodeToken = (token): DecodedToken => {
    return jwtDecode<DecodedToken>(token);
};
