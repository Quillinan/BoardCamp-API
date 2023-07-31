import connection from "../database/database.connection.js";
export const customersController = {
  getCustomers: async (_, res) => {
    try {
      const customer = await connection.query(
        "SELECT *, TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday FROM customers"
      );
      res.send(customer.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  getCustomerById: async (req, res) => {
    const customerId = req.params.id;

    try {
      const query =
        "SELECT *, TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday FROM customers WHERE id=$1";
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

      res.status(201).json({ message: "Cliente criado com sucesso!" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao criar cliente.", details: err.message });
    }
  },
  updateCustomer: async (req, res) => {
    try {
      const customerId = req.params.id;
      const existingCustomer = await connection.query(
        "SELECT * FROM customers WHERE id = $1",
        [customerId]
      );

      if (existingCustomer.rows.length === 0) {
        return res.status(404).json({ error: "Cliente não encontrado." });
      }

      const { name, phone, birthday, cpf } = req.body;

      const existingCpf = await connection.query(
        "SELECT * FROM customers WHERE cpf = $1 AND id <> $2",
        [cpf, customerId]
      );

      if (existingCpf.rows.length > 0) {
        return res
          .status(409)
          .json({ error: "Já existe outro cliente com o mesmo CPF." });
      }

      const updateQuery =
        "UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5 RETURNING *";
      const values = [name, phone, cpf, birthday, customerId];
      const updatedCustomer = await connection.query(updateQuery, values);

      res.status(200).json(updatedCustomer.rows[0]);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro ao atualizar cliente.", details: err.message });
    }
  },
};
