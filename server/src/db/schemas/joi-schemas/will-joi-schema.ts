import joi from 'joi';

const createWillJoiSchema = joi.object({
    title: joi.string().required().min(10), // 10자 이상 ?
    content: joi.string().required().min(10), // 10자 이상
    receivers: joi.array().items(
        joi.object({
            receiverId: joi.string(),
            email: joi.string().email(),
        }),
    ),
});

const updateWillJoiSchema = joi.object({
    title: joi.string().min(10), // 10자 이상 ?
    content: joi.string().min(10), // 10자 이상
    receivers: joi.array().items(
        joi.object({
            receiverId: joi.string(),
            email: joi.string().email(),
        }),
    ),
});
export { createWillJoiSchema, updateWillJoiSchema };
