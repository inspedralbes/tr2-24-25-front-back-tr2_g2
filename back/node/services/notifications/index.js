/* ----------------------------------------- IMPORTS ----------------------------------------- */
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
const FormData = require('form-data');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3008;

/* ----------------------------------------- SERVER APP ----------------------------------------- */
app.use(express.json());
app.use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});
// app.use(fileUpload());

/* ----------------------------------------- DATABASE ----------------------------------------- */
const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
};

/* ----------------------------------------- ROUTES ----------------------------------------- */
// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World! XDDDDDDDDDDDDDDD I am a notifications service');
});

app.get('/getNotifications', async (req, res) => {
    const { user_id } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM notifications WHERE user_id = ?', [user_id]);
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/notifications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM notifications WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'Notification not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/notifications', async (req, res) => {

    const { user_id, description, chat_id, report_id, publication_id, request_id, comment_id, revised } = req.body;
    console.log("user_id notification", user_id);
    console.log("desciption", description);
    console.log("request_id", request_id);
    if (!user_id) {
        return res.status(400).json({ error: 'User id is required.' });
    }

    console.log("body", req.body);

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO notifications (user_id, description, chat_id, report_id, publication_id, request_id, comment_id, revised) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, description || null, chat_id || null, report_id || null, publication_id || null, request_id || null, comment_id || null, revised || null]
        );

        console.log("result", result);

        res.status(201).json({
            notificationId: result.insertId,
            user_id,
            description,
            chat_id,
            report_id,
            publication_id,
            request_id,
            comment_id
        });

        connection.end();
        console.log('Notification created:', result);

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ error: 'Database error' });
    }

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 