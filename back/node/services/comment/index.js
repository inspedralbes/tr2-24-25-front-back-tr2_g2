const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const http = require('http');
const cors = require('cors');
const { strict } = require('assert');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

/* ----------------------------------------- DATABASE ----------------------------------------- */

const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
};

app.get('/', (req, res) => {
    res.send('Hello World! XDDDDDDDDDDDDDDD I am a comment service');
});

/*---------------------------------------------------------------------------------------------- */
app.get('/comments', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM comments');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM comments WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'Comment not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});
app.post('/comments', async (req, res) => {
    const { publication_id, user_id, commentReply_id, comment } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO comments (publication_id, user_id, commentReply_id, comment) VALUES (?, ?, ?, ?)',
            [publication_id, user_id, commentReply_id, comment]
        );
        connection.end();

        res.json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { publication_id, user_id, commentReply_id, comment } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE comments SET publication_id = ?, user_id = ?, commentReply_id = ?, comment = ? WHERE id = ?',
            [publication_id, user_id, commentReply_id, comment, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Comment not found' });

        res.json({ message: 'Comment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM comments WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Comment not found' });

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});