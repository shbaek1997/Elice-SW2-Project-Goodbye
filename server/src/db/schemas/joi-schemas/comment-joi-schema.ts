import joi from 'joi';

const createCommentJoiSchema = joi.object({
    writer:joi.string().required(),
    title: joi.string().required().min(10), // 10자 이상 ?
    content: joi.string().required().min(10), // 10자 이상
    password: joi.string().required().min(8),
});

const updateCommentJoiSchema =joi.object({
    writer:joi.string(),
    title: joi.string().min(10), // 10자 이상 ?
    content: joi.string().min(10), // 10자 이상
    password: joi.string().min(8),
});


export { createCommentJoiSchema, updateCommentJoiSchema };
