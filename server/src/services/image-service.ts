import { s3 } from '../config/s3';

const domain = process.env.CLOUDFRONT_DOMAIN as string;

export class ImageService {
    // 이미지 등록
    static addImage(file: Express.MulterS3.File) {
        const { key } = file;
        const imagePath = `${domain}/${key}`;

        return imagePath;
    }

    // 이미지 삭제
    static deleteImage(imagePath: string) {
        const key = imagePath.replace(`${domain}/`, '');

        s3.deleteObject(
            {
                Bucket: 'elice-good-bye-project',
                Key: key,
            },
            (error) => {
                if (error) {
                    throw new Error(
                        '삭제할 이미지가 없습니다. 다시 확인해주세요.',
                    );
                }
            },
        );
    }
}
