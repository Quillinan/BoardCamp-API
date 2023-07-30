import connection from "../database/database.connection.js"


export const gamesController = {
    getGames: async (_, res) => {
        try {
            const games = await connection.query(`SELECT * FROM games;`)
            res.send(games.rows)
        } catch (err) {
            res.status(500).send(err.message)
        }

    }
}

