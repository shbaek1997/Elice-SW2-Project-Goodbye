import joi from 'joi';

const createWillJoiSchema = joi.object({
    title: joi.string().required().min(10), // 10자 이상 ?
    content: joi.string().required().min(10), // 10자 이상
    receivers: joi.array().required().items(joi.string().required()),
});

const updateWillJoiSchema =joi.object({
    title: joi.string().min(10), // 10자 이상 ?
    content: joi.string().min(10), // 10자 이상
    receivers: joi.array().items(joi.string().required()),
});


export { createWillJoiSchema, updateWillJoiSchema };
