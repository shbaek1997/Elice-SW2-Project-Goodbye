import multerS3 from 'multer-s3';
import multer from 'multer';
import { Request } from 'express';
import { s3 } from '../config/s3';

const uploadImage = multer({
    storage: multerS3({
        s3,
        bucket: 'elice-good-bye-project',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read-write',
        key: (req: Request, file, callback: any) => {
            const fileName = `photo/${Date.now()}.jpg`;
            callback(null, fileName);
        },
    }),
    fileFilter(req, file, callback) {
        const extension = file.mimetype.split('/')[1];
        if (!['png', 'jpg', 'jpeg', 'gif', 'bmp'].includes(extension)) {
            return callback(new Error('이미지 파일을 등록해 주세요.'));
        }

        return callback(null, true);
    },
});

export { uploadImage };
