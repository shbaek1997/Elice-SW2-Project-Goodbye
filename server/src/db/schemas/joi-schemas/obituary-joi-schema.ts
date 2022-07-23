import joi from 'joi';

const createObituaryJoiSchema = joi.object({
    deceased: joi.string().required(),
    dateOfBirth: joi.date().min('1900-01-01').iso().required(),
    dateOfDeath: joi
        .date()
        .min(joi.ref('dateOfBirth'))
        .max('now')
        .iso()
        .required(),
    age: joi.number().required(),
    sex: joi.string().valid('남자', '여자').required(),
    family: joi
        .array()
        .items(
            joi.object().keys({
                relation: joi.string().required(),
                fullName: joi.string().required(),
            }),
        )
        .required(),
    funeral: joi.string().required(),
    dateOfCremate: joi.date().min(joi.ref('dateOfDeath')).iso(),
    comment: joi.string().min(10),
    password: joi.string(),
});

const updateObituaryJoiSchema = joi.object({
    deceased: joi.string(),
    dateOfBirth: joi.date().min('1900-01-01').iso(),
    dateOfDeath: joi.date().min(joi.ref('dateOfBirth')).max('now').iso(),
    age: joi.number(),
    sex: joi.string().valid('남자', '여자'),
    family: joi.array().items(
        joi.object().keys({
            relation: joi.string().required(),
            fullName: joi.string().required(),
        }),
    ),
    funeral: joi.string(),
    dateOfCremate: joi.date().min(joi.ref('dateOfDeath')).iso(),
    comment: joi.string().min(10),
});

export { createObituaryJoiSchema, updateObituaryJoiSchema };
