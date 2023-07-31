import connection from "../database/database.connection.js";
import dayjs from "dayjs";
export const rentalsController = {
  postRental: async (req, res) => {
    try {
      const { customerId, gameId, daysRented } = req.body;

      const existingCustomer = await connection.query(
        "SELECT * FROM customers WHERE id = $1",
        [customerId]
      );

      if (existingCustomer.rows.length === 0) {
        return res.status(400).json({ error: "Cliente não encontrado." });
      }

      const existingGame = await connection.query(
        "SELECT * FROM games WHERE id = $1",
        [gameId]
      );

      if (existingGame.rows.length === 0) {
        return res.status(400).json({ error: "Jogo não encontrado." });
      }

      const rentalsQuery =
        'SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL';

      const { rows: totalRented } = await connection.query(rentalsQuery, [
        gameId,
      ]);
      const { stockTotal } = existingGame.rows[0];

      if (totalRented.length >= stockTotal) {
        return res
          .status(400)
          .json({ error: "Não há jogos disponíveis para locação." });
      }

      // Popule automaticamente os campos rentDate e originalPrice antes de salvar o aluguel
      const rentDate = dayjs().format("YYYY-MM-DD");
      const originalPrice = daysRented * existingGame.rows[0].pricePerDay;

      // Defina os campos returnDate e delayFee como null antes de salvar o aluguel
      const returnDate = null;
      const delayFee = null;

      const insertQuery =
        'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      const values = [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ];
      const newRent = await connection.query(insertQuery, values);

      res.status(201).json({ message: "Aluguel criado com sucesso!" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar aluguel.", details: err.message });
    }
  },
};
