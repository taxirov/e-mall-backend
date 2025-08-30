import Joi from "joi";

export const userValidationSchemaRegister = Joi.object({
    nickname: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required()
})

export const userLoginByPhone = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required()
})

export const userLoginByNickname= Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required()
})

export const userLoginByEmail = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required()
})