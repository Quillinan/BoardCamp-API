import { Router } from "express";
import { customersController } from "../controllers/customers.controller.js";

const customersRouter = Router();

// Rota para obter todos os clientes
customersRouter.get("/", customersController.getCustomers);

// Rota para obter cliente pelo id
customersRouter.get("/:id", customersController.getCustomerById);

export default customersRouter;
