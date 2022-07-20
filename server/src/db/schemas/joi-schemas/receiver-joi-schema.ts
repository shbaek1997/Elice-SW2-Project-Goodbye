import joi from 'joi';

const createReceiverJoiSchema = joi.object({
    fullName: joi.string().required(),
    emailAddress: joi.string().email().required(),
    relation: joi.string().required(),
});

const updateReceiverJoiSchema = joi.object({
    fullName: joi.string(),
    emailAddress: joi.string().email(),
    relation: joi.string(),
});


export { createReceiverJoiSchema, updateReceiverJoiSchema };
