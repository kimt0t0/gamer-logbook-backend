import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from 'src/interfaces/DecodedToken.interface';

export const isolateToken = (headers) => {
    return headers
        .find((header) => header.startsWith('Bearer'))
        .replace('Bearer', '')
        .replace(' ', '');
};

export const decodeToken = (token): DecodedToken => {
    return jwtDecode<DecodedToken>(token);
};
