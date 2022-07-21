import joi from 'joi';

const createWillJoiSchema = joi.object({
    title: joi.string().required().min(10).messages({
        'string.empty': '유언장 제목은 비어있을 수 없습니다.',
        'any.required': '유언장 제목은 반드시 입력되어야 합니다.',
        'string.min': '유언장 제목은 최소 10글자 이상이어야 합니다.',
    }), // 10자 이상 ?
    content: joi.string().required().min(10).messages({
        'string.empty': '유언장 내용은 비어있을 수 없습니다.',
        'any.required': '유언장 내용은 반드시 입력되어야 합니다.',
        'string.min': '유언장 내용은 최소 10글자 이상이어야 합니다.',
    }), // 10자 이상
    receivers: joi.array().items(
        joi.object({
            receiverId: joi.string().messages({
                'string.empty': '수신자 아이디는 비어있을 수 없습니다.',
            }),
            email: joi.string().email().messages({
                'string.empty': '수신자 이메일은 비어있을 수 없습니다.',
                'string.email': '올바르지 않은 이메일 형식입니다.',
            }),
        }),
    ),
});

const updateWillJoiSchema = joi.object({
    title: joi.string().min(10).messages({
        'string.empty': '유언장 제목은 비어있을 수 없습니다.',
        'string.min': '유언장 제목은 최소 10글자 이상이어야 합니다.',
    }), // 10자 이상 ?
    content: joi.string().min(10).messages({
        'string.empty': '유언장 내용은 비어있을 수 없습니다.',
        'string.min': '유언장 내용은 최소 10글자 이상이어야 합니다.',
    }), // 10자 이상
    receivers: joi.array().items(
        joi.object({
            receiverId: joi.string().messages({
                'string.empty': '수신자 아이디는 비어있을 수 없습니다.',
            }),
            email: joi.string().email().messages({
                'string.empty': '수신자 이메일은 비어있을 수 없습니다.',
                'string.email': '올바르지 않은 이메일 형식입니다.',
            }),
        }),
    ),
});
export { createWillJoiSchema, updateWillJoiSchema };
