const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'db', // Default to 'db' if not provided
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'user123',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'db123'
});
module.exports = pool;

const port = 6000
const axios = require('axios');
const AUTH_SERVICE_URL = 'http://auth:4000';
const app = express();

const cors = require('cors');
app.use(cors());

// Middleware to authenticate JWT by verifying with the auth service
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            // Call the auth service to verify the token
            const response = await axios.post(`${AUTH_SERVICE_URL}/verify-token`, { token });
            if (response.data.valid) {
                req.user = response.data.user;
                next();
            } else {
                res.sendStatus(401);
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
};

// allow the app to accept json
app.use(express.json());

// routes
app.get('/', authenticateJWT, async (req, res) => {
    try {
        const data = await pool.query(`SELECT * FROM letters`);
        res.status(200).send(data.rows);
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});

app.post('/', authenticateJWT, async (req, res) => {
    const { name, country, content } = req.body
    const userId = req.user.userId;
    try {
        await pool.query(`INSERT INTO letters (name, country, content, user_id) VALUES ($1, $2, $3, $4)`, [name, country, content, userId]);
        res.status(200).send({message: 'Letter sent successfully'});
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
            content VARCHAR(1000) NOT NULL,
            user_id INTEGER NOT NULL
        )`);

        res.status(200).send({message: 'Tables created successfully'});
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
})


app.listen(port, () => console.log(`Server running on port ${port}`));