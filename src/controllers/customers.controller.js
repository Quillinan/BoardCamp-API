import connection from "../database/database.connection.js";
export const customersController = {
  getCustomers: async (_, res) => {
    try {
      const customer = await connection.query(`SELECT * FROM customers;`);
      res.send(customer.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  getCustomerById: async (req, res) => {
    const customerId = req.params.id;

    try {
      const query = "SELECT * FROM customers WHERE id = $1;";
      const result = await connection.query(query, [customerId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Cliente não encontrado." });
      }

      const customer = result.rows[0];
      res.status(200).json(customer);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao buscar cliente.", details: err.message });
    }
  },
  postCustomer: async (req, res) => {
    try {
      const { cpf } = req.body;
      const existingCustomer = await connection.query(
        "SELECT * FROM customers WHERE cpf = $1",
        [cpf]
      );

      if (existingCustomer.rows.length > 0) {
        return res.status(409).json({ error: "Cliente já existe." });
      }

      const { name, phone, birthday } = req.body;
      const insertQuery =
        "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4) RETURNING *";
      const values = [name, phone, cpf, birthday];
      const newCustomer = await connection.query(insertQuery, values);

      res.status(201).json(newCustomer.rows[0]);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar cliente.", details: err.message });
    }
  },
};
