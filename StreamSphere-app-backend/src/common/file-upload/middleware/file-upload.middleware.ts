import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const multerOptions = {
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, callback) => {
        if (!file.mimetype) {
            return callback(new BadRequestException('Invalid file type'), false);
        }
        callback(null, true);
    },
    storage: diskStorage({
        destination: '/tmp',
        filename: (req, file, callback) => {
            const fileName = `${Date.now()}-${file.originalname}`;
            callback(null, fileName);
        }
    })
};
