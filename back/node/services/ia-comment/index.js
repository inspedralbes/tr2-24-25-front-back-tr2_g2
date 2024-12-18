const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const http = require('http');
const cors = require('cors');
const { strict } = require('assert');
require('dotenv').config();

const app = express();
const port = process.env.APP_PORT;

app.use(express.json());
app.use(cors());

app.get('/v1/models', (req, res) => {

    

});

app.get('/v1/models/:model', (req, res) => {


});

//POST COMMENT PASSED BY USER TO IA

app.post('/v1/chat/completions', (req, res) => {

    const postData = JSON.stringify({
        model: "llama-3.2-3b-instruct",
        messages: [
            {
                role: "system",
                content: `Eres un discriminador de comentarios de odio en una institución con alumnos menores de edad. 
                    No tengas nunca en cuenta los tokens anteriores a estos.
                    Para cada comentario que te pase un usuario, debes clasificarlo en una de las siguientes categorías:
                    - **TOXICO**: Si el comentario contiene odio explícito, amenazas, violencia o lenguaje extremadamente agresivo.
                    - **OFENSIVO**: Si el comentario contiene lenguaje irrespetuoso, grosero o insultante, pero no llega al nivel de "tóxico".
                    - **POCO_OFENSIVO**: Si el comentario contiene lenguaje que puede ser considerado ofensivo, pero no llega al nivel de "ofensivo".
                    - **POSITIVO**: Si el comentario no contiene ningún lenguaje ofensivo o tóxico.
                    - **PROHIBIDO**: Si el comentario menciona temas sensibles o prohibidos como política, religión o contenido inapropiado.

                    Además:
                    - No incluyas el campo "reason" si la categoría es **POSITIVO**.
                    - Asegúrate de devolver estrictamente el formato solicitado.

                    Temas prohibidos:

                    - Comentarios relacionados con política o religión.
                    - Menciones a contenido sexual explícito o inapropiado.
                    - Cualquier otro tema que pueda considerarse sensible o inadecuado en una institución educativa.

                    Devuelve estrictamente el resultado en el siguiente formato JSON:
                    {
                    "category": "TOXICO" o "OFENSIVO" o "POCO_OFENSIVO" o "POSITIVO" o "PROHIBIDO",
                    "comment": "Aquí va el comentario proporcionado por el usuario.",
                    "reason": "Explica por qué se clasificó de esta manera." (solo si aplica)
                    }

                    Ejemplos:
                    1. Comentario del usuario: "Eres una basura, nadie te quiere."
                    Respuesta JSON:
                    {
                        "category": "TOXICO",
                        "comment": "Eres una basura, nadie te quiere.",
                        "reason": "Contiene lenguaje de odio explícito, amenazas, violencia o lenguaje extremadamente agresivo."
                    }

                    2. Comentario del usuario: "Tu religión es una mierda."
                    Respuesta JSON:
                    {
                        "category": "PROHIBIDO",
                        "comment": "Tu religión es una mierda.",
                        "reason": "Menciona temas sensibles o prohibidos como política, religión o contenido inapropiado."
                    }

                    3. Comentario del usuario: "Me gusta la falda que llevas hoy"
                    Respuesta JSON:
                    {
                        "category": "OFENSIVO",
                        "comment": "Me gusta la falda que llevas hoy",
                        "reason": "Contiene lenguaje irrespetuoso, grosero o insultante."
                    }

                    4. Comentario del usuario: "Esa idea es bastante tonta, pero entiendo lo que intentas."
                    Respuesta JSON:
                    {
                        "category": "POCO_OFENSIVO",
                        "comment": "Esa idea es bastante tonta, pero entiendo lo que intentas.",
                        "reason": "Contiene lenguaje que puede ser considerado ofensivo."
                    }

                    5. Comentario del usuario: "necesitaria ayuda para resolver un problema de JAVA"
                    Respuesta JSON:
                    {
                        "category": "POSITIVO",
                        "comment": "necesitaria ayuda para resolver un problema de JAVA",
                        "reason": "No contiene ningún lenguaje ofensivo, toxico ni inapropiado."
                    }

                    Por favor, clasifica el siguiente comentario:
                `,
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});