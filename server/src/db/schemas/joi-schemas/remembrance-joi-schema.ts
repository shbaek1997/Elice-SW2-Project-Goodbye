import joi from 'joi';

const createRemembranceJoiSchema = joi.object({
    dateOfDeath: joi.date().required(),
});
const updateRemembranceJoiSchema = joi.object({
    fullName:joi.string(),
    dateOfBirth:joi.date(),
    dateOfDeath:joi.date(),
    isPublic: joi.boolean(),
    photo: joi.string().uri(),
})

export { createRemembranceJoiSchema, updateRemembranceJoiSchema };
