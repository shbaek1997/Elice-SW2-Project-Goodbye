import joi from 'joi';

const updateDeathDayJoiSchema = joi.date().max('now').iso().messages({
    'date.max': '사망일은 오늘 이후일 수 없습니다.',
    'date.format': '사망일은 yyyy-mm-dd 형식이어야 합니다.',
});

export { updateDeathDayJoiSchema };
