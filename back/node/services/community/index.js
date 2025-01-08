/* ----------------------------------------- IMPORTS ----------------------------------------- */
const fileUpload = require('express-fileupload');
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;

/* ----------------------------------------- SERVER APP ----------------------------------------- */
app.use(express.json());
app.use(cors({
    origin: `*`,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(fileUpload());

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
    res.send('Hello World! XDDDDDDDDDDDDDDD I am a community service');
});

app.use('/upload', express.static(path.join(__dirname, 'upload')));

// CRUD operations for comments
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
        res.status(201).json({ message: 'Comment created successfully' });
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

// CRUD operations for publications
app.get('/publications', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM publications');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});




// Post publications conectada a la ia 
app.post('/publications', async (req, res) => {
    try {
        // Extraer datos del request
        const { typesPublications_id, title, description, user_id, expired_at } = req.body;
        const { publication_id, report, status } = req.body;
        // Validación de datos (AÑADIDO)
        if (!title || !description || !req.files || !req.files.image) {
            return res.status(400).json({ error: 'Faltan datos obligatorios (título, descripción, imagen).' });
        }

        const analyzeContent = async (content) => {
            const responseAI = await fetch("http://localhost:1234/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: "meta-llama-3-8b-instruct",
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
                                        - Asegúrate de devolver estrictamente el formato solicitado.
            
                                        Es absolutamente obligatorio que la respuesta sea un JSON válido. No añadas explicaciones, encabezados, ni ningún texto adicional fuera del formato JSON proporcionado. Responde únicamente con el JSON en la siguiente forma exacta:
                                        {
                                            "category": "TOXICO" o "OFENSIVO" o "POCO_OFENSIVO" o "POSITIVO" o "PROHIBIDO",
                                            "reason": "Explica por qué se clasificó de esta manera."
                                        }

                                        Algunos ejemplos a tener en cuenta:
            
                                        **Odio explícito, amenazas, violencia o lenguaje extremadamente agresivo, es TOXICO.**
                                        **Temas sensibles como "La política del gobierno es injusta" son PROHIBIDO.**
                                        **Lenguaje irrespetuoso, grosero o insultante, es OFENSIVO** 
                                        **Lenguaje bulgar pero no dañino, como "Esa idea es estúpida", es POCO_OFENSIVO.**
                                        **Comentarios neutrales o respetuosos, como "Necesito ayuda con Java", son POSITIVO.**`,
                        },
                        { role: "user", content }
                    ],

                    temperature: 0.7,
                    stream: false
                }),
            });

            if (!responseAI.ok) {
                throw new Error(`Error en la IA: ${responseAI.status} - ${await responseAI.text()}`);
            }

            const aiResponse = await responseAI.json();
            const contentString = aiResponse.choices[0].message.content;
            let contentObject;

            // Parsear el contenido para obtener category y reason
            try {
                contentObject = JSON.parse(contentString);
            } catch (error) {
                console.error("Error al parsear la respuesta de la IA:", error);
                throw new Error("Respuesta de la IA no válida.");
            }

            return contentObject;
        };

        let titleAnalysis, descriptionAnalysis;
        try {
            titleAnalysis = await analyzeContent(title);
            descriptionAnalysis = await analyzeContent(description);
        } catch (error) {
            console.error("Error al llamar a la IA:", error);
            return res.status(500).json({ error: 'Error al analizar el titulo y la descripción con la IA.' });
        }

        const imageFile = req.files.image;
        const imageName = `${Date.now()}-${imageFile.name}`;
        const imagePath = path.join(__dirname, 'upload', imageName);

        // Mover el archivo a la carpeta 'upload'
        await imageFile.mv(imagePath);

        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));

        const serverMjsUrl = 'http://localhost:3006/classify-image'; //URL del servidor de IA.
        let imageAnalysis;
        try {
            const fetchPromise = await import('node-fetch');
            const fetch = fetchPromise.default;
            const response = await fetch(serverMjsUrl, {
                method: 'POST',
                body: formData,
                headers: formData.getHeaders(),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Error al analizar la imagen: ${response.status} - ${JSON.stringify(error)}`);
            }
            imageAnalysis = await response.json();

        } catch (fetchError) {

            console.error("Error al llamar a la IA:", fetchError);

            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error al eliminar la imagen temporal:", err);
            });
            return res.status(500).json({ error: 'Error al analizar la imagen con la IA.' });
        }

        let result;
        try {
            const connection = await mysql.createConnection(dbConfig);
            const report = `title analysis ${titleAnalysis.reason} - description analysis: ${descriptionAnalysis.reason} - image analysis: ${imageAnalysis.reason}`;


            if (titleAnalysis.category === 'TOXICO' || titleAnalysis.category === 'OFENSIVO' || titleAnalysis.category === 'PROHIBIDO' ||
                descriptionAnalysis.category === 'TOXICO' || descriptionAnalysis.category === 'OFENSIVO' || descriptionAnalysis.category === 'PROHIBIDO' ||
                imageAnalysis.category === 'OFENSIVA' || (imageAnalysis.category === 'POTENCIALMENTE_SUGERENTE' && imageAnalysis.subcategory === 'OFENSIVO')) {

                [result] = await connection.execute(
                    `INSERT INTO reportspublications (publication_id, user_id, report, status) VALUES (?, ?, ?, ?)`,
                    [
                        publication_id,
                        user_id,
                        report,
                        'pending'
                    ]
                );
            }

            [result] = await connection.execute(
                'INSERT INTO publications (typesPublications_id, title, description, user_id, image, expired_at) VALUES (?, ?, ?, ?, ?, ?)',
                [typesPublications_id, title, description, user_id, `/upload/${imageName}`, expired_at || null]
            );

            connection.end();

        } catch (dbError) {
            // Manejo de error en la base de datos
            console.error("Error en la base de datos:", dbError);
            // Eliminar la imagen temporal si falla la base de datos
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error al eliminar la imagen temporal:", err);
            });
            return res.status(500).json({ error: 'Error al guardar la publicación en la base de datos.' });
        }

        res.status(201).json({
            publicationId: result.insertId,
            titleAnalysis,
            descriptionAnalysis,
            imageAnalysis,
        });

    } catch (error) {
        console.error("Error general en /publications:", error);
        res.status(500).json({ error: 'Error interno del servidor al crear la publicación' });
    }
});

app.get('/publications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM publications WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'Publication not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/publications', async (req, res) => {
    const { title, description, user_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO publications (typesPublications_id, title, description, user_id) VALUES (?, ?, ?, ?)',
            [1, title, description, user_id]
        );
        connection.end();
        res.status(201).json({ message: 'Publication created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/publications/:id', async (req, res) => {
    const { id } = req.params;
    const { typesPublications_id, title, description, user_id, reports } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE publications SET typesPublications_id = ?, title = ?, description = ?, user_id = ?, reports = ? WHERE id = ?',
            [typesPublications_id, title, description, user_id, reports, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Publication not found' });

        res.json({ message: 'Publication updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/publications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM publications WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Publication not found' });

        res.json({ message: 'Publication deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for reportsPublications
app.get('/reports/publications', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM reportsPublications');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/reports/publications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM reportsPublications WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'ReportPublication not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/reports/publications', async (req, res) => {
    const { publication_id, user_id, report, status } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO reportsPublications (publication_id, user_id, report, status) VALUES (?, ?, ?, ?)',
            [publication_id, user_id, report, status]
        );
        connection.end();
        res.status(201).json({ message: 'ReportPublication created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/reports/publications/:id', async (req, res) => {
    const { id } = req.params;
    const { publication_id, user_id, report, status } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE reportsPublications SET publication_id = ?, user_id = ?, report = ?, status = ? WHERE id = ?',
            [publication_id, user_id, report, status, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'ReportPublication not found' });

        res.json({ message: 'ReportPublication updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/reports/publications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM reportsPublications WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'ReportPublication not found' });

        res.json({ message: 'ReportPublication deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});