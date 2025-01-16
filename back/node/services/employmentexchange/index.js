/* ----------------------------------------- IMPORTS ----------------------------------------- */
const fileUpload = require('express-fileupload');
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const FormData = require('form-data');
const { request } = require('http');
const { text } = require('stream/consumers');
require('dotenv').config();

const app = express();
const port = 24843;

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
app.use(fileUpload());

/* ----------------------------------------- DATABASE ----------------------------------------- */
const dbConfig = {
    host: "localhost",
    user: "a21sarmarbau_mentories",
    password: "Chocolate1",
    database: "a21sarmarbau_mentories"
};

/* ----------------------------------------- ROUTES ----------------------------------------- */
// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World! XDDDDDDDDDDDDDDD I am a employment exchange service');
});

app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.get('/comments', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM comments WHERE text_ia = 1');
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
            const serverIA = 'http://conexus.dam.inspedralbes.cat:24845/classify-comment';
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

        const isReportableComent = (analysis_comment) => ['TOXICO', 'OFENSIVO', 'PROHIBIDO'].includes(analysis_comment.category);

        try {
            const connection = await mysql.createConnection(dbConfig);
            report = `Comment reason: ${commentAnalysis.reason}`;
            const category = commentAnalysis.category;
            console.log("category", category);

            const [result] = await connection.execute(
                'INSERT INTO comments (publication_id, user_id, commentReply_id, comment, category, text_ia) VALUES (?, ?, ?, ?, ?, ?)',
                [publication_id, user_id, commentReply_id, comment, category, 1]
            );
            const comment_id = result.insertId;
            let reasons = [];
            if (isReportableComent(commentAnalysis)) {
                reasons.push(`comentari: ${commentAnalysis.reason}`);
            }

            if (reasons.length > 0) {
                const notificationDescription = `S'ha generat un report del teu comentari en una publicació. Reason: ${commentAnalysis.reason}`;
                const [resultReport] = await connection.execute(
                    `INSERT INTO reportscomments (comment_id, user_id, report, status) VALUES (?, ?, ?, ?)`,
                    [comment_id, user_id, report, 'pending']
                );

                console.log("result report", resultReport);

                const notificationPayload = {
                    user_id: user_id,
                    description: notificationDescription,
                    comment_id: comment_id,
                    publication_id: publication_id,
                    report_id: resultReport.insertId,
                    revised: 0
                };

                await connection.execute(
                    `UPDATE comments SET reported = reported + 1 WHERE id = ?`,
                    [comment_id]
                );

                console.log("notification content", notificationPayload);

                try {
                    console.log("notification fetch");
                    const notificationResponse = await fetch('http://conexus.dam.inspedralbes.cat:24846/notifications', {
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
            }

            res.status(201).json({
                message: 'comment creat correctament!',
                comment_id,
                publication_id,
                commentAnalysis,
                user_id,
                textIA: 1
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
                'INSERT INTO comments (publication_id, user_id, commentReply_id, comment, text_ia) VALUES (?, ?, ?, ?, ?)',
                [publication_id, user_id, commentReply_id, comment, 0]
            );
            const comment_id = result.insertId;
            res.status(201).json({
                message: 'comment creat, pendent de revisió!',
                comment_id,
                publication_id,
                user_id,
                textIA: 0
            });

            const notificacionReason = 'El teu comentari sera revisat més tard! Gràcies per la teva paciència';

            notificationIAnoResponse = {
                user_id: user_id,
                description: notificacionReason,
                comment_id: comment_id,
                publication_id: publication_id,
                revised: 0
            };

            console.log("notification if no response ia", notificationIAnoResponse);
            connection.end();
        } catch (error) {
            res.status(500).json({ error: 'Error al analizar contenido', details: error.message });
        }

        try {
            const notificationResponse = await fetch('http://conexus.dam.inspedralbes.cat:24846/notifications', {
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

// CRUD operations for publications
app.get('/publications', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM publications WHERE typesPublications_id = 2 AND text_ia = 1 AND image_ia = 1');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
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

app.get('/getMyPublications', async (req, res) => {
    console.log("user_id recibido:", req.query.user_id); // Confirma el valor
    const { user_id } = req.query;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM publications WHERE user_id = ? AND typesPublications_id = 2', [user_id]);
        console.log("Datos obtenidos:", rows); // Muestra los datos obtenidos
        connection.end();

        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});



app.post('/publications', async (req, res) => {
    const { title, description, user_id, availability, expired_at } = req.body;
    var notificationIAnoResponse;

    console.log("file", req.files);
    console.log("body", req.body);

    if (!title || !description || !req.files || !req.files.image) {
        return res.status(400).json({ error: 'Faltan datos obligatorios (título, descripción, imagen).' });
    }

    const imageFile = req.files.image;
    const imageName = `${Date.now()}-${imageFile.name}`;
    const imagePath = path.join(__dirname, 'upload', imageName);

    await imageFile.mv(imagePath);

    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    var running = await checkIA();
    console.log("running", running);
    let textIA = 0, imageIA = 0;
    if (running == true) {
        // Llamada a la IA para analizar título y descripción
        const analyzeContent = async (content) => {
            console.log("HOLA 1");
            const serverIA = 'http://conexus.dam.inspedralbes.cat:24845/classify-comment';
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
        };

        let titleAnalysis = null, descriptionAnalysis = null;

        try {
            console.log("HOLA 2");
            titleAnalysis = await analyzeContent(title);
            descriptionAnalysis = await analyzeContent(description);
            textIA = 1;
        } catch (error) {
            console.error("Error al llamar a la IA", error);
            return res.status(500).json({ error: 'Error al analizar título o descripción.', details: error.message });
        }

        // Manejo de imagen
        // Llamada a la IA para analizar la imagen
        const serverMjsUrl = 'http://conexus.dam.inspedralbes.cat:24844/classify-image';

        let imageAnalysis = null;
        try {
            const fetchPromise = await import('node-fetch');
            const fetch = fetchPromise.default;
            const response = await fetch(serverMjsUrl, {
                method: 'POST',
                body: formData,
                headers: formData.getHeaders(),
            });

            if (!response.ok)
                throw new Error(`Error IA imagen: ${response.statusText}`);

            imageAnalysis = await response.json();
            imageIA = 1;
        } catch (fetchError) {
            console.error("Error al llamar a la IA:", fetchError);

            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error al eliminar la imagen temporal:", err);
            });
            return res.status(500).json({ error: 'Error al analizar la imagen con la IA.' });
        }

        const isReportableComment = (analysis_comment) => ['TOXICO', 'OFENSIVO', 'PROHIBIDO'].includes(analysis_comment.category);

        // Guardar en base de datos
        try {
            const connection = await mysql.createConnection(dbConfig);
            const report = `Análisis: título (${titleAnalysis.category} | ${titleAnalysis.reason}), Descripció (${descriptionAnalysis.category} | ${descriptionAnalysis.reason}), imagen (${imageAnalysis.category} | ${imageAnalysis.reason})`;

            const [result] = await connection.execute(
                'INSERT INTO publications (typesPublications_id, title, description, user_id, image, availability, reports, text_ia, image_ia, expired_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [2, title, description, user_id, `/upload/${imageName}`, availability, 0, 1, 1, expired_at || null]
            );
            const publication_id = result.insertId;

            let reasons = [];
            if (isReportableComment(titleAnalysis)) {
                reasons.push(`títul: ${titleAnalysis.reason}`);
            }
            if (isReportableComment(descriptionAnalysis)) {
                reasons.push(`descripción: ${descriptionAnalysis.reason}`);
            }
            if (imageAnalysis.category === 'OFENSIVA' || (imageAnalysis.category === 'POTENCIALMENTE_SUGERENTE' && imageAnalysis.subcategory === 'OFENSIVO')) {
                reasons.push(`imagen: ${imageAnalysis.reason}`);
            }

            console.log("Hola 3");

            if (reasons.length > 0) {
                const notificationDescription = `S'ha generat un report al postejar una petició. Reason: ${reasons.join(', ')}.`;

                const [resultReport] = await connection.execute(
                    `INSERT INTO reportspublications (publication_id, user_id, report, status) VALUES (?, ?, ?, ?)`,
                    [publication_id, user_id, report, 'pending']
                );

                console.log("Hola 4");

                console.log("resultReport ID:", resultReport.insertId);

                // Hacer fetch a las notificaciones
                const notificationPayload = {
                    user_id,
                    description: notificationDescription,
                    request_id: publication_id,
                    report_id: resultReport.insertId,
                };

                await connection.execute(
                    `UPDATE publications SET reports = reports + 1 WHERE id = ?`,
                    [publication_id]
                );

                console.log("notification content", notificationPayload);

                try {
                    console.log("Hola 5");
                    const notificationResponse = await fetch('http://conexus.dam.inspedralbes.cat:24846/notifications', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(notificationPayload),
                    });

                    console.log("response notification", notificationResponse);

                    if (!notificationResponse.ok) {
                        console.error("Error al enviar la notificación:", await notificationResponse.text());
                    }
                } catch (notificationError) {
                    console.error("Error al realizar el fetch de la notificación:", notificationError);
                }
            }

            res.status(201).json({
                publicationId: publication_id,
                titleAnalysis,
                descriptionAnalysis,
                imageAnalysis,
                textIA,
                imageIA,
            });
            connection.end();
        } catch (error) {
            fs.unlink(imagePath, () => { }); // Limpieza
            res.status(500).json({ error: 'Error al guardar la publicación en la base de datos.', details: error.message });
        }
    } else {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [result] = await connection.execute(
                `INSERT INTO publications (typesPublications_id, title, description, user_id, image, availability, text_ia, image_ia, expired_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [2, title, description, user_id, `/upload/${imageName}`, availability, textIA, imageIA, expired_at || null]
            );
            const publication_id = result.insertId;
            res.status(201).json({
                publication_id: publication_id,
                text_ia: 0,
                image_ia: 0,
            });

            const notificationReason = 'Tu publicació sera revisada més tard! Gràcies per la teva paciència.';

            notificationIAnoResponse = {
                user_id,
                description: notificationReason,
                publication_id: publication_id,
            };
            console.log("notification if no response ia", notificationIAnoResponse);
            connection.end();

        } catch (error) {
            res.status(500).json({ error: 'Error al analizar contenido', details: error.message });
        }

        try {
            const notificationResponse = await fetch('http://conexus.dam.inspedralbes.cat:24846/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notificationIAnoResponse),
            });

            if (!notificationResponse.ok) {
                console.error("Error al enviar la notificación:", await notificationResponse.text());
            }
        } catch (notificationError) {
            console.error("Error al realizar el fetch de la notificación:", notificationError);
        }

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

async function checkIA() {

    var running = true;
    const serverIAtext = 'http://conexus.dam.inspedralbes.cat:24844/';
    const serverIAimage = 'http://conexus.dam.inspedralbes.cat:24845/';

    try {
        const responseText = await fetch(serverIAtext);
        if (!responseText.ok) throw new Error(`Error IA: ${responseText.statusText}`);

        const responseImage = await fetch(serverIAimage);
        if (!responseImage.ok) throw new Error(`Error IA: ${responseImage.statusText}`);

    } catch (error) {
        running = false;
        console.error(`Error al analizar contenido: ${error.message}`);
    }
    return running;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});