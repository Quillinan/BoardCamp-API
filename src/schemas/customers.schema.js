import Joi from "joi";

export const customerSchema = Joi.object({
  cpf: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required(),
  name: Joi.string().trim().min(1).required(),
  birthday: Joi.date().iso().required(),
});
