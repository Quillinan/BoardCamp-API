import { Router } from "express";
import { rentalsController } from "../controllers/rentals.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { rentalsSchema } from "../schemas/rentals.schema.js";

const rentalsRouter = Router();

// Rota para buscar todos os aluguéis
rentalsRouter.get("/", rentalsController.getRentals);

// Rota para criar um novo aluguel
rentalsRouter.post(
  "/",
  validateSchema(rentalsSchema),
  rentalsController.postRental
);

export default rentalsRouter;
