import joi from 'joi';

const createRemembranceJoiSchema = joi.object({
    userId: joi.string().required(),
    fullName: joi.string().required(),
    dateOfBirth: joi.date().min('1900-01-01').iso().required(),
});

const updateRemembranceJoiSchema = joi.object({
    fullName: joi.string().required(),
    dateOfBirth: joi.date().min('1900-01-01').iso().required(),
    dateOfDeath: joi.date().min(joi.ref('dateOfBirth')).max('now').iso(),
    isPublic: joi.boolean(),
    photo: joi.string().uri(),
});

export { createRemembranceJoiSchema, updateRemembranceJoiSchema };
