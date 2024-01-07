const express = require('express');
const pool = require('./db');
const port = 3000

const app = express();

// allow the app to accept json
app.use(express.json());

// routes
app.get('/', async (req, res) => {
    try {
        const data = await pool.query(`SELECT * FROM letters`);
        res.sendStatus(200).send(data.rows);
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});

app.post('/', async (req, res) => {
    const { name, country, content } = req.body
    try {
        await pool.query(`INSERT INTO letters (name, country, content) VALUES ($1, $2, $3)`, [name, country, content]);
        res.sendStatus(200).send({message: 'Letter sent successfully'});
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
})

app.get('/setup', async (req, res) => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS letters (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            country VARCHAR(255) NOT NULL,
            content VARCHAR(1000) NOT NULL
        )`);
        res.status(200).send({message: 'Table created successfully'});
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
})

app.listen(port, () => console.log(`Server running on port ${port}`));