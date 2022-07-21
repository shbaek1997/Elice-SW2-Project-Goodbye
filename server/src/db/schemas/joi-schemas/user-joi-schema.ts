import joi from 'joi';

const registerJoiSchema = joi.object({
    email: joi.string().email().lowercase().required().messages({
        'string.empty': '이메일은 비어있을 수 없습니다.',
        'any.required': '이메일은 반드시 입력되어야 합니다.',
        'string.email': '올바르지 않은 이메일 형식입니다.',
    }),
    fullName: joi.string().required().messages({
        'string.empty': '이름은 비어있을 수 없습니다.',
        'any.required': '이름은 반드시 입력되어야 합니다.',
    }),
    password: joi.string().required().min(8).messages({
        'string.empty': '비밀번호는 비어있을 수 없습니다.',
        'any.required': '비밀번호는 반드시 입력되어야 합니다.',
        'string.min': '비밀번호는 최소 8글자 이상이어야 합니다.',
    }),
    repeatPassword: joi.string().required().min(8).messages({
        'string.empty': '비밀번호는 비어있을 수 없습니다.',
        'any.required': '비밀번호는 반드시 입력되어야 합니다.',
        'string.min': '비밀번호는 최소 8글자 이상이어야 합니다.',
    }),
    dateOfBirth: joi.date().required().iso().min('1900-01-01').messages({
        'any.required': '생년월일은 반드시 입력되어야 합니다.',
        'date.base': '올바른 날짜 형식이 아닙니다.',
        'date.format': '올바른 날짜 형식이 아닙니다. (0000-00-00)',
        'date.min': '생년월일은 1990년 1월 1일 이상이어야 합니다.',
    }),
});

const userUpdateJoiSchema = joi.object({
    fullName: joi.string().messages({
        'string.empty': '이름은 비어있을 수 없습니다.',
    }),
    password: joi.string().min(8),
    currentPassword: joi.string().min(8).required().messages({
        'string.empty': '현재 비밀번호는 비어있을 수 없습니다.',
        'any.required': '현재 비밀번호는 반드시 입력되어야 합니다.',
        'string.min': '비밀번호는 최소 8글자 이상이어야 합니다.',
    }),
    dateOfBirth: joi.date().iso().min('1900-01-01').messages({
        'date.base': '올바른 날짜 형식이 아닙니다.',
        'date.format': '올바른 날짜 형식이 아닙니다. (0000-00-00)',
        'date.min': '생년월일은 1990년 1월 1일 이상이어야 합니다.',
    }),
    photo: joi.string().uri().messages({
        'string.empty': '사진은 비어있을 수 없습니다.',
        'string.uri': '올바르지 않은 url 형식입니다.',
    }),
});

export { registerJoiSchema, userUpdateJoiSchema };
