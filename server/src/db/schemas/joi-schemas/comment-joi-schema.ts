import joi from 'joi';

const createCommentJoiSchema = joi.object({
    writer: joi.string().required(),
    title: joi.string().required(),
    content: joi.string().required().min(10),
    password: joi.string().required().min(4),
});

const updateCommentJoiSchema = joi.object({
    writer: joi.string(),
    title: joi.string(),
    content: joi.string().min(10),
});

export { createCommentJoiSchema, updateCommentJoiSchema };
