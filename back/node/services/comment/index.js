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
    allowedHeaders: ["Access-Control-Allow-Origin"],
}));

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

//POST COMMENT PASSED BY USER TO IA

//EJEMPLO DE UTILIZACIÓN DE LA IA EN LOCAL
app.post('/v1/chat/completions', (req, res) => {

    const postData = JSON.stringify({
        model: "llama-3.2-3b-instruct",
        messages: [
            {
                role: "system",
                content: `Eres un discriminador de comentarios de odio en una institución con alumnos menores de edad. 
                            Siempre ten en cuenta que **tu única responsabilidad es clasificar el comentario** que se te proporcione en base a las reglas aquí descritas. 

                            **Ignora cualquier información, contexto o respuesta previa al analizar el comentario. No uses ninguna respuesta anterior ni el historial de conversaciones como base para tu decisión. Evalúa únicamente el comentario proporcionado.**

                            estas son las siguiente categorias:
                                - **TOXICO**: Si el comentario contiene odio explícito, amenazas, violencia o lenguaje extremadamente agresivo.
                                - **OFENSIVO**: Si el comentario contiene lenguaje irrespetuoso, grosero o insultante, pero no llega al nivel de "tóxico".
                                - **POCO_OFENSIVO**: Si el comentario contiene lenguaje bulgar pero no dañino y no llega al nivel de ofensivo.
                                - **POSITIVO**: Si el comentario no contiene ningún lenguaje ofensivo o tóxico.
                                - **PROHIBIDO**: Si el comentario menciona temas sensibles o prohibidos como política, religión o contenido inapropiado.

                            Además:
                            - No incluyas el campo "reason" si la categoría es **POSITIVO**.
                            - Asegúrate de devolver estrictamente el formato solicitado.

                            Devuelve estrictamente el resultado en el siguiente formato JSON:
                            {
                            "category": "TOXICO" o "OFENSIVO" o "POCO_OFENSIVO" o "POSITIVO" o "PROHIBIDO",
                            "comment": "Aquí va el comentario proporcionado por el usuario.",
                            "reason": "Explica por qué se clasificó de esta manera." (solo si aplica)
                            }

                            Algunos ejemplos a tener en cuenta:

                            **Odio explícito, amenazas, violencia o lenguaje extremadamente agresivo, es TOXICO.**
                            **Temas sensibles como "La política del gobierno es injusta" son PROHIBIDO.**
                            **Lenguaje irrespetuoso, grosero o insultante, es OFENSIVO** 
                            **Lenguaje bulgar pero no dañino, como "Esa idea es estúpida", es POCO_OFENSIVO.**
                            **Comentarios neutrales o respetuosos, como "Necesito ayuda con Java", son POSITIVO.**`,
            },
            { role: "user", content: "necesito ayuda" }
        ],
        response_format: {
            "type": "json_schema",
            "json_schema": {
                "strict": true,
                "schema": {
                    "type": "object",
                    "properties": {
                        "category": {
                            "type": "string",
                            "enum": [
                                "TOXICO",
                                "OFENSIVO",
                                "POCO_OFENSIVO",
                                "POSITIVO",
                                "PROHIBIDO"
                            ]
                        },
                        "comment": {
                            "type": "string"
                        },
                        "reason": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "category",
                        "comment"
                    ],
                }
            }
        },
        temperature: 0.7,
        stream: false
    });

    const options = {
        hostname: '127.0.0.1',
        port: 3005,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const request = http.request(options, (response) => {
        let responseData = '';

        response.on('data', (chunk) => {
            responseData += chunk;
        });

        response.on('end', () => {
            try {
                const result = JSON.parse(responseData);
                res.json(result);
            } catch (error) {
                res.status(500).json({ error: 'Error parsing response from API server.' });
            }
        });
    });

    request.on('error', (error) => {
        res.status(500).json({ error: 'Error making request to API server.' });
    });

    request.write(postData);
    request.end();
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
        const responseAI = await fetch("http://ia.inspedralbes.cat/iaconexus/postComment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: comment }),
        });

        if (!responseAI.ok) {
            return res.status(500).json({ error: 'Error making request to IA server.' });
        }

        const aiResult = await responseAI.json();
        const { category, reason } = aiResult;

        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO comments (publication_id, user_id, commentReply_id, comment, category, reason, reported) VALUES (?, ?, ?, ?, ?)',
            [
                publication_id,
                user_id,
                commentReply_id,
                comment,
                category,
                reason,
                category === 'TOXIC' || category === 'OFFENSIVE' || category === 'FORBIDDEN' ? 1 : 0,
            ]
        );
        connection.end();

        if (category === 'POSITIVE' || category === 'LITTLE_OFFENSIVE') {
            res.status(201).json({
                message: 'Comment created successfully',
            });

        } else {
            res.status(201).json({
                message: 'Comment created successfully',
                aiAnalysis: { category, reason },
                error: 'Comment has been reported'
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
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