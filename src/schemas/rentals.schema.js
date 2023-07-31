import Joi from "joi";

export const rentalsSchema = Joi.object({
  customerId: Joi.number().integer().positive().min(1).required(),
  gameId: Joi.number().integer().positive().min(1).required(),
  daysRented: Joi.number().integer().positive().min(1).required(),
});
