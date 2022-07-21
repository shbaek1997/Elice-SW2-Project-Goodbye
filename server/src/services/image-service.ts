import { s3 } from '../config/s3';
import { userModel } from '../db';
import { remembranceService } from './remembrance-service';
import { userService } from './user-service';

const domain = process.env.CLOUDFRONT_DOMAIN as string;

export class ImageService {
    // 이미지 등록
    static async addImage(
        userId: string,
        key: string,
    ): Promise<{ photo: string }> {
        // 기존 이미지가 있을 경우 삭제
        const { photo } = await userService.getUser(userId);
        if (photo) {
            this.deleteImage(userId, photo);
        }

        // 유저 및 추모 데이터에 저장
        const update = { photo: `${domain}/${key}` };
        await userModel.updateById(userId, update);
        await remembranceService.setRemembrance(userId, update);

        return update;
    }

    // 이미지 삭제
    static async deleteImage(
        userId: string,
        imagePath: string,
    ): Promise<{ result: string }> {
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

        // 유저 및 추모 데이터에도 반영
        const update = { photo: '' };
        await userModel.updateById(userId, update);
        await remembranceService.setRemembrance(userId, update);

        return { result: 'success' };
    }
}
