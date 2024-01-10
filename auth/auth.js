const express = require('express');
const { Pool } = require('pg');

// Use environment variables for database credentials
const pool = new Pool({
    host: process.env.DB_HOST || 'db-auth', // Default to 'db' if not provided
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'user123',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'db123'
});

module.exports = pool;

const port = 4000
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'mySuperSecretKey123!@#';

const app = express();

const cors = require('cors');
app.use(cors());

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// allow the app to accept json
app.use(express.json());

app.get('/users', authenticateJWT, async (req, res) => {
    try {
        const data = await pool.query(`SELECT * FROM users`);
        res.status(200).send(data.rows);
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});

app.get('/setup', async (req, res) => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )`);

        res.status(200).send({message: 'Tables created successfully'});
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
})

// User registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        if (error.code === '23505') { // Postgres error code for unique_violation
            res.status(409).send({ message: 'Username already exists' });
        } else {
            console.error(error.message);
            res.status(500).send({ message: 'An error occurred during user registration' });
        }
    }
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the database for a user with the provided username
        const data = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        // If a user with the username exists
        if (data.rows.length > 0) {
            const user = data.rows[0];
            const hashedPassword = user.password; // Assuming 'password' is the field name for the hashed password
            
            // Compare the provided password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, hashedPassword);
            
            if (isPasswordValid) {
                // If the password is valid, sign and send the JWT
                const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
                res.status(200).send({ token });
            } else {
                // If the password is invalid, send an error response
                res.status(401).send({ message: 'Invalid credentials' });
            }
        } else {
            // If no user is found with that username, send an error response
            res.status(404).send({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});

app.post('/verify-token', (req, res) => {
    const { token } = req.body;
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ valid: false });
        }
        res.json({ valid: true, user });
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));