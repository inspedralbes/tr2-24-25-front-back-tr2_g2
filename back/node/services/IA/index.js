const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express());
app.use(cors());

app.post('/classify-comment', (req, res) => {
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ error: 'El comentario es requerido.' });
    }

    const options = {
        hostname: process.env.HOSTNAME,
        port: process.env.PORT,
        path: '/completion',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify({
                prompt: `
                    Eres un discriminador de comentarios de odio en una institución con alumnos menores de edad. 
                    Para cada comentario que te pase un usuario, debes clasificarlo en una de las siguientes categorías:
                    - **TOXICO**: Si el comentario contiene odio explícito, amenazas, violencia o lenguaje extremadamente agresivo.
                    - **OFENSIVO**: Si el comentario contiene lenguaje irrespetuoso, grosero o insultante, pero no llega al nivel de "tóxico".
                    - **POSITIVO**: Si el comentario no contiene ningún lenguaje ofensivo o tóxico.

                    Además, guarda el comentario original proporcionado por el usuario en el campo \`comment\`.

                    Devuelve estrictamente el resultado en el siguiente formato JSON:
                    {
                      "category": "TOXICO" o "OFENSIVO" o "POSITIVO",
                      "comment": "Aquí va el comentario proporcionado por el usuario."
                    }

                    Por favor, clasifica el siguiente comentario:
                    "${comment}"
                `,
                max_tokens: 100,
                temperature: 0.7
            }))
        }
    }

    const request = http.request(options, (response) => {

    })
});

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
});