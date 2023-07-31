import { Router } from "express";
import { customersController } from "../controllers/customers.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customers.schema.js";

const customersRouter = Router();

// Rota para obter todos os clientes
customersRouter.get("/", customersController.getCustomers);

// Rota para obter cliente pelo id
customersRouter.get("/:id", customersController.getCustomerById);

// Rota para criar um novo cliente
customersRouter.post(
  "/",
  validateSchema(customerSchema),
  customersController.postCustomer
);

export default customersRouter;
