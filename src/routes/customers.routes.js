import { Router } from "express";
import { customersController } from "../controllers/customers.controller.js";

const customersRouter = Router();

// Rota para obter todos os games
customersRouter.get("/", customersController.getCustomers);

export default customersRouter;
