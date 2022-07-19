import bcrypt from 'bcrypt';
import {
    createObituaryJoiSchema,
    updateObituaryJoiSchema,
} from '../db/schemas/joi-schemas';
import { IUpdateObituary, obituaryModel, ObituaryModel } from '../db';
import { IFamily, IObituary } from '../db/schemas/obituary-schema';

export interface ICreateObituary {
    deceased: string;
    dateOfBirth: string;
    dateOfDeath: string;
    sex: string;
    family: Array<IFamily>;
    funeral: string;
    dateOfCremate?: string;
    comment?: string;
    password: string;
}

const saltOrRounds = Number(process.env.SALT_OR_ROUNDS);

class ObituaryService {
    obituaryModel: ObituaryModel;

    constructor() {
        this.obituaryModel = obituaryModel;
    }

    // 새 부고 생성
    async addObituary(obituaryInfo: ICreateObituary): Promise<IObituary> {
        const { dateOfBirth, dateOfDeath, password } = obituaryInfo;

        const age =
            new Date(dateOfDeath).getFullYear() -
            new Date(dateOfBirth).getFullYear() +
            1;
        const hashedPassword = await bcrypt.hash(
            password as string,
            saltOrRounds,
        );

        const newInfo = {
            ...obituaryInfo,
            age,
            password: hashedPassword,
        };
        await createObituaryJoiSchema.validateAsync(newInfo);

        const obituary = await this.obituaryModel.create(newInfo);

        return obituary;
    }

    // 특정 부고 조회
    async getObituaryById(obituaryId: string): Promise<IObituary> {
        const obituary = await this.obituaryModel.findById(obituaryId);

        return obituary;
    }

    // 부고 수정
    async setObituary(
        obituaryId: string,
        currentPassword: string,
        update: IUpdateObituary,
    ): Promise<IObituary> {
        // 해당 부고 조회
        const obituary = await this.getObituaryById(obituaryId);
        const {
            dateOfBirth: originBirth,
            dateOfDeath: originDeath,
            password: hashedPassword,
        } = obituary;

        // 비밀번호 일치하는지 확인
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            hashedPassword,
        );
        if (!isPasswordCorrect) {
            throw new Error(
                '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.',
            );
        }

        // 탄생일 혹은 사망일 수정 시 age 수정
        const { dateOfBirth: newBirth, dateOfDeath: newDeath } = update;
        const dateOfBirth = newBirth || originBirth;
        const dateOfDeath = newDeath || originDeath;
        const age =
            new Date(dateOfDeath).getFullYear() -
            new Date(dateOfBirth).getFullYear() +
            1;

        const newInfo = {
            ...update,
            dateOfBirth,
            dateOfDeath,
            age,
        };
        await updateObituaryJoiSchema.validateAsync(newInfo);

        const updatedObituary = await this.obituaryModel.update(
            obituaryId,
            newInfo,
        );

        return updatedObituary;
    }

    // 부고 삭제
    async deleteObituary(
        obituaryId: string,
        currentPassword: string,
    ): Promise<object> {
        // 해당 부고의 비밀번호 조회
        const obituary = await this.getObituaryById(obituaryId);
        const hashedPassword = obituary.password;

        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            hashedPassword,
        );
        if (!isPasswordCorrect) {
            throw new Error(
                '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.',
            );
        }

        await this.obituaryModel.delete(obituaryId);

        return { result: 'success' };
    }
}

const obituaryService = new ObituaryService();

export { obituaryService };
