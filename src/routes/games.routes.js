import { Router } from "express"
import { gamesController } from "../controllers/games.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { gameSchema } from "../schemas/games.schema.js"


const gamesRouter = Router()

// Rota para obter todos os games
gamesRouter.get("/", gamesController.getGames);

export default gamesRouter