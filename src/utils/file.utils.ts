import { unlink } from 'fs';
import { basename, join } from 'path';

export function deleteFile(dirname, imageUrl): void {
    const filePath = join(dirname, '..', '..', '..', 'public/uploads', basename(imageUrl));
    unlink(filePath, (err) => {
        if (err) {
            console.error(`Failed to delete image file: ${filePath}`, err);
        }
    });
}
