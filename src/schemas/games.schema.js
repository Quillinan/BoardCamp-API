import Joi from "joi";

export const gameSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  image: Joi.string().uri().required(),
  stockTotal: Joi.number().integer().min(0).required(),
  pricePerDay: Joi.number().positive().min(0).required(),
});
