import { Router } from "express"
import gamesRouter from "./games.routes.js"

const router = Router();

router.get("/", (_, res) => {
  res.send("Boardcamp vive!!");
});
router.use("/games", gamesRouter);

export default router