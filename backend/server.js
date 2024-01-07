const express = require('express');
const pool = require('./db');
const port = 3000
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'mySuperSecretKey123!@#';

const app = express();

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

app.get('/users', authenticateJWT, async (req, res) => {
    try {
        const data = await pool.query(`SELECT * FROM users`);
        res.status(200).send(data.rows);
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});

app.post('/', authenticateJWT, async (req, res) => {
    const { name, country, content } = req.body
    try {
        await pool.query(`INSERT INTO letters (name, country, content) VALUES ($1, $2, $3)`, [name, country, content]);
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
            content VARCHAR(1000) NOT NULL
        )`);

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
                const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
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

app.listen(port, () => console.log(`Server running on port ${port}`));