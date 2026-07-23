import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';

const multer = require('multer');

@Injectable()
export class CommonMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}
  use(req: any, res: any, next: (error?: any) => void) {
    const upload = multer({
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (file.mimetype.startsWith('image')) {
            cb(null, './uploads/images');
          } else if (file.mimetype.startsWith('video')) {
            cb(null, './uploads/videos');
          } else {
            cb(new Error('Unsupported file type'), '');
          }
        },
        filename: (req, file, cb) => {
          const uniqueName = Date.now(); // single number filename
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
          cb(null, true);
        } else {
          cb(new Error('Only images and videos are allowed'), false);
        }
      },
      limits: { fileSize: 500 * 1024 * 1024 },
    }).any();

    upload(req, res, (err: any) => {
      if (err) return next(err);

      // Use global host from environment variable
      const HOST = this.configService.get<string>('HOST');
      const PORT = this.configService.get<string>('PORT');
      const baseUrl = `${HOST}:${PORT}`;

      if (req.files && req.files.length > 0) {
        req.files = req.files.map((file: any) => {
          if (file.mimetype.startsWith('image')) {
            file.fullUrl = `${baseUrl}/uploads/images/${file.filename}`;
          } else if (file.mimetype.startsWith('video')) {
            file.fullUrl = `${baseUrl}/uploads/videos/${file.filename}`;
          }
          return file;
        });
      }

      next();
    });
  }
}