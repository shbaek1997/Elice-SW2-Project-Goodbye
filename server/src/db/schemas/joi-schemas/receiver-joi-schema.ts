import joi from 'joi';

const createReceiverJoiSchema = joi.object({
    fullName: joi.string().required().messages({
        'string.empty': '이름은 비어있을 수 없습니다.',
        'any.required': '이름은 반드시 입력되어야 합니다.',
    }),
    emailAddress: joi.string().email().required().messages({
        'string.empty': '이메일은 비어있을 수 없습니다.',
        'any.required': '이메일은 반드시 입력되어야 합니다.',
        'string.email': '올바르지 않은 이메일 형식입니다.',
    }),
    relation: joi.string().required().messages({
        'string.empty': '관계는 비어있을 수 없습니다.',
        'any.required': '관계는 반드시 입력되어야 합니다.',
    }),
});

const updateReceiverJoiSchema = joi.object({
    fullName: joi.string().messages({
        'string.empty': '이름은 비어있을 수 없습니다.',
    }),
    emailAddress: joi.string().email().messages({
        'string.empty': '이메일은 비어있을 수 없습니다.',
        'string.email': '올바르지 않은 이메일 형식입니다.',
    }),
    relation: joi.string().messages({
        'string.empty': '관계는 비어있을 수 없습니다.',
    }),
});


export { createReceiverJoiSchema, updateReceiverJoiSchema };
