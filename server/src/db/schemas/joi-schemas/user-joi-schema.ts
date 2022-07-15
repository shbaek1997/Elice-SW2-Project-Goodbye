import joi from 'joi';

const registerJoiSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    fullName: joi.string().required(),
    password:joi.string().required().min(8),
    repeatPassword:joi.string().required().min(8),
    dateOfBirth: joi.date().required(),
});

const userUpdateJoiSchema = joi.object({
    fullName:joi.string(),
    password: joi.string().min(8),
    currentPassword: joi.string().min(8),
    dateOfBirth: joi.date(),
    photo: joi.string().uri(),

})

export { registerJoiSchema, userUpdateJoiSchema };
