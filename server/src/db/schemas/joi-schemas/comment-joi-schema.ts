import joi from 'joi';

const createCommentJoiSchema = joi.object({
    writer: joi.string().required(),
    title: joi.string().required(),
    content: joi.string().min(10).required(),
    password: joi.string().min(4).required(),
});

const updateCommentJoiSchema = joi.object({
    writer: joi.string(),
    title: joi.string(),
    content: joi.string().min(10),
    password: joi.string().min(4).required(),
});

const deleteCommentJoiSchema = joi.string().min(4).required();

export {
    createCommentJoiSchema,
    updateCommentJoiSchema,
    deleteCommentJoiSchema,
};
