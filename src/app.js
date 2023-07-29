import express from "express";
import cors from "cors";
import "dotenv/config";
import connection from "./database/database.js";

// Criação do app
const app = express();

// Configurações
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
