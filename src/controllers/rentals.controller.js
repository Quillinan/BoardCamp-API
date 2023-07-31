import connection from "../database/database.connection.js";
import dayjs from "dayjs";
export const rentalsController = {
  getRentals: async (_, res) => {
    try {
      const rentals = await connection.query(`
      SELECT rentals.*, 
          TO_CHAR(rentals."rentDate", 'YYYY-MM-DD') AS "rentDate",
          TO_CHAR(rentals."returnDate", 'YYYY-MM-DD') AS "returnDate", 
          customers."name" as "customerName", 
          games."name" as "gameName"
      FROM rentals
      JOIN customers ON rentals."customerId"=customers.id
      JOIN games ON rentals."gameId"=games.id;`);

      const formattedRentals = rentals.rows.map((rental) => ({
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer: { id: rental.customerId, name: rental.customerName },
        game: { id: rental.gameId, name: rental.gameName },
      }));

      res.status(200).send(formattedRentals);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
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
  returnRental: async (req, res) => {
    const { id } = req.params;
    try {
      const rental = await connection.query(
        `SELECT * FROM rentals WHERE id=$1;`,
        [id]
      );
      if (rental.rowCount === 0) {
        return res.status(404).send({ message: "Aluguel não encontrado." });
      }

      if (rental.rows[0].returnDate !== null) {
        return res.status(400).send({ message: "Aluguel já finalizado." });
      }

      const { daysRented, rentDate, originalPrice } = rental.rows[0];
      const pricePerDay = originalPrice / daysRented;

      let delayFee = 0;

      const returnDate = dayjs().format("YYYY-MM-DD");
      const datesDifference = dayjs().diff(rentDate, "day");

      if (datesDifference > daysRented) {
        delayFee = pricePerDay * (datesDifference - daysRented);
      }

      await connection.query(
        `UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`,
        [returnDate, delayFee, id]
      );

      res.status(200).send({ message: "Aluguel finalizado!" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  deleteRental: async (req, res) => {
    const { id } = req.params;
    try {
      const rental = await connection.query(
        `SELECT * FROM rentals WHERE id=$1;`,
        [id]
      );
      if (rental.rowCount === 0) {
        return res.status(404).send({ message: "Aluguel não encontrado." });
      }

      if (rental.rows[0].returnDate == null) {
        return res.status(400).send({ message: "Aluguel em andamento." });
      }

      await connection.query(`DELETE FROM rentals WHERE id=$1;`, [id]);

      res.status(200).send({ message: "Aluguel deletado!" });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};
