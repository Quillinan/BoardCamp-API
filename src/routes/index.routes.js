import { Router } from "express";
import gamesRouter from "./games.routes.js";
import customersRouter from "./customers.routes.js";

const router = Router();

router.get("/", (_, res) => {
  res.send("Boardcamp vive!!");
});
router.use("/games", gamesRouter);
router.use("/customers", customersRouter);

export default router;
