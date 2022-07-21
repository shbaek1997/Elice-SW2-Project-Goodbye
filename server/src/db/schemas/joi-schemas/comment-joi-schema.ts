import joi from 'joi';

const createCommentJoiSchema = joi.object({
    writer: joi.string().trim().required().messages({
        'any.required': '작성자는 반드시 작성해야 합니다.',
        'string.empty': '작성자는 빈 값일 수 없습니다.',
    }),
    title: joi.string().trim().required().messages({
        'any.required': '제목은 반드시 작성해야 합니다.',
        'string.empty': '제목은 빈 값일 수 없습니다.',
    }),
    content: joi.string().trim().min(10).required().messages({
        'any.required': '내용은 반드시 작성해야 합니다.',
        'string.empty': '내용은 빈 값일 수 없습니다.',
        'string.min': '내용은 10자 이상이어야 합니다.',
    }),
    password: joi.string().trim().min(4).required().messages({
        'any.required': '비밀번호는 반드시 작성해야 합니다.',
        'string.empty': '비밀번호는 빈 값일 수 없습니다.',
        'string.min': '비밀번호는 4자 이상이어야 합니다.',
    }),
});

const updateCommentJoiSchema = joi.object({
    writer: joi.string().trim().messages({
        'string.empty': '작성자는 빈 값일 수 없습니다.',
    }),
    title: joi.string().trim().messages({
        'string.empty': '제목은 빈 값일 수 없습니다.',
    }),
    content: joi.string().trim().min(10).messages({
        'string.empty': '내용은 빈 값일 수 없습니다.',
        'string.min': '내용은 10자 이상이어야 합니다.',
    }),
    password: joi.string().trim().min(4).required().messages({
        'any.required': '비밀번호는 반드시 작성해야 합니다.',
        'string.empty': '비밀번호는 빈 값일 수 없습니다.',
        'string.min': '비밀번호는 4자 이상이어야 합니다.',
    }),
});

const deleteCommentJoiSchema = joi.string().trim().min(4).required().messages({
    'any.required': '비밀번호는 반드시 작성해야 합니다.',
    'string.empty': '비밀번호는 빈 값일 수 없습니다.',
    'string.min': '비밀번호는 4자 이상이어야 합니다.',
});

export {
    createCommentJoiSchema,
    updateCommentJoiSchema,
    deleteCommentJoiSchema,
};
