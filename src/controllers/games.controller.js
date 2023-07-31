import connection from "../database/database.connection.js";
export const gamesController = {
  getGames: async (_, res) => {
    try {
      const games = await connection.query(`SELECT * FROM games;`);
      res.send(games.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  postGame: async (req, res) => {
    try {
      const { name } = req.body;
      const existingGame = await connection.query(
        "SELECT * FROM games WHERE name = $1",
        [name]
      );

      if (existingGame.rows.length > 0) {
        return res.status(409).json({ error: "Jogo com esse nome já existe." });
      }

      const { image, stockTotal, pricePerDay } = req.body;
      const insertQuery =
        'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [name, image, stockTotal, pricePerDay];
      const newGame = await connection.query(insertQuery, values);

      res.status(201).json({ message: "Jogo criado com sucesso!" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar jogo.", details: err.message });
    }
  },
};
