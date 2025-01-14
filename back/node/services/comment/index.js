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
    var notificationIAnoResponse;
    var report;

    console.log("body", req.body);

    var running = await checkIA();
    console.log("running", running);
    let textIA = 0;
    if (running == true) {
        const analyzeContent = async (content) => {
            console.log("HOLA 1");
            const serverIA = 'http://localhost:3005/classify-comment';
            try {
                const response = await fetch(serverIA, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment: content }),
                });
                if (!response.ok) throw new Error(`Error IA: ${response.statusText}`);
                return await response.json();
            } catch (error) {
                console.error(`Error al analizar contenido: ${error.message}`);
                return null;
            }
        }
        let commentAnalysis = null;
        try {
            console.log("analisis comment");
            commentAnalysis = await analyzeContent(comment);
            textIA = 1;
        } catch (error) {
            console.error("Error al llamar a la ia", error);
            return res.status(500).json({ error: 'Error al analizar el comment', details: error.message });
        }

        try {
            const connection = await mysql.createConnection(dbConfig);
            report = `Comment reason: ${commentAnalysis.reason}`;
            const category = commentAnalysis.category;
            console.log("category", category);

            const [result] = await connection.execute(
                'INSERT INTO comments (publication_id, user_id, commentReply_id, comment, category, reason, text_ia) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [publication_id, user_id, commentReply_id, comment, category, reason, 1]
            );
            const comment_id = result.insertId;

            const notificationDescription = `S'ha generat un report del comentari amb id ${comment_id} en aquesta publicació: ${publication_id}. Reason: ${commentAnalysis.reason}`;
            const [resultReport] = await connection.execute(
                `INSERT INTO reportscomments (comment_id, user_id, reason) VALUES (?, ?, ?)`,
                [comment_id, user_id, report]
            );

            console.log("result report", resultReport);

            const notificationPayload = {
                user_id: user_id,
                description: notificationDescription,
                comment_id: comment_id,
                publication_id: publication_id,
                report_id: resultReport.insertId
            };

            await connection.execute(
                `UPDATE comments SET reported = reported + 1 WHERE id = ?`,
                [comment_id]
            );

            console.log("notification content", notificationPayload);

            try {
                console.log("notification fetch");
                const notificationResponse = await fetch('http://localhost:3003/notifications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(notificationPayload),
                });
                console.log("response notification", notificationResponse);

                if (!notificationResponse.ok)
                    console.error(`Error al enviar notificacion: ${notificationResponse.statusText}`);
            } catch (error) {
                console.error("Error al realizar notificacion", error);
            }

            res.status(201).json({
                message: 'Comment created successfully',
                comment_id,
                publication_id,
                commentAnalysis,
                user_id,
                textIA
            });
            connection.end();

        } catch (error) {
            console.error("Error al enviar notificacion", error);
            return res.status(500).json({ error: 'Error al enviar notificacion', details: error.message });
        }
    } else {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [result] = await connection.execute(
                'INSERT INTO comments (publication_id, user_id, commentReply_id, comment, text_ia) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [publication_id, user_id, commentReply_id, comment, 0]
            );
            const comment_id = result.insertId;
            res.status(201).json({
                message: 'Comment created successfully',
                comment_id,
                publication_id,
                user_id,
                textIA
            });

            const notificacionReason = 'El teu comentari sera revisat més tard! Gràcies per la teva paciència';

            notificationIAnoResponse = {
                user_id: user_id,
                description: notificacionReason,
                comment_id: comment_id,
                publication_id: publication_id
            };

            console.log("notification if no response ia", notificationIAnoResponse);
            connection.end();
        } catch (error) {
            res.status(500).json({ error: 'Error al analizar contenido', details: error.message });
        }

        try {
            const notificationResponse = await fetch('http://localhost:3003/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notificationIAnoResponse),
            });

            if (!notificationResponse.ok)
                console.error(`Error al enviar notificacion: ${notificationResponse.statusText}`);
        } catch (error) {
            res.status(500).json({ error: 'Error al enviar notificacion', details: error.message });
        }
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

async function checkIA() {

    var running = true;
    const serverIAtext = 'http://localhost:3005/';

    try {
        const responseText = await fetch(serverIAtext);
        if (!responseText.ok) throw new Error(`Error IA: ${responseText.statusText}`);


    } catch (error) {
        running = false;
        console.error(`Error al analizar contenido: ${error.message}`);
    }
    return running;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});