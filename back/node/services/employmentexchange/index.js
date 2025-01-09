/* ----------------------------------------- IMPORTS ----------------------------------------- */
const fileUpload = require('express-fileupload');
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const FormData = require('form-data');
const { request } = require('http');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3003;

/* ----------------------------------------- SERVER APP ----------------------------------------- */
app.use(express.json());
app.use(cors({
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin"],
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
    res.send('Hello World! XDDDDDDDDDDDDDDD I am a employment exchange service');
});

app.use('/upload', express.static(path.join(__dirname, 'upload')));

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
    const { title, description, user_id, availability, reports } = req.body;

    console.log("bodyy", req.body);
    console.log("files", req.files);

    if (!title || !description) {
        return res.status(400).json({ error: 'Faltan dades' })
    }

    const analyzeContent = async (content) => {
        const serverIA = 'http://localhost:3004/classify-comment';
        try {
            const response = await fetch(serverIA, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: content }),
            });
            if (!response.ok) throw new Error(`Error IA: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            throw new Error(`Error al analizar contenido: ${error.message}`);
        }
    };

    let titleAnalysisPeticio, descriptionAnalysisPeticio;

    try {
        titleAnalysisPeticio = await analyzeContent(title);
        descriptionAnalysisPeticio = await analyzeContent(description);
    } catch (error) {
        console.error("Error al llamar a la IA", error);
        return res.status(500).json({ error: 'Error al analizar título o descripción.', details: error.message });
    }

    const imageFile = req.files.image;
    const imageName = `${Date.now()}-${imageFile.name}`;
    const imagePath = path.join(__dirname, 'upload', imageName);

    await imageFile.mv(imagePath);

    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    const serverMjsUrl = 'http://localhost:3006/classify-image';

    let imageAnalysisPeticio;
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

        imageAnalysisPeticio = await response.json()

    } catch (fetchError) {
        console.error("Error al llamar a la IA:", fetchError);

        fs.unlink(imagePath, (err) => {
            if (err) console.error("Error al eliminar la imagen temporal:", err);
        });
        return res.status(500).json({ error: 'Error al analizar la imagen con la IA.' });
    }

    const isReportableCommentPeticio = (analysis_comment) => ['TOXICO', 'OFENSIVO', 'PROHIBIDO'].includes(analysis_comment.category)

    try {
        const connection = await mysql.createConnection(dbConfig);
        const report = `Análisis: título (${titleAnalysisPeticio.category} | ${titleAnalysisPeticio.reason}), Descripció (${descriptionAnalysisPeticio.category} | ${descriptionAnalysisPeticio.reason}), imagen (${imageAnalysisPeticio.category} | ${imageAnalysisPeticio.reason})`;

        const [result] = await connection.execute(
            'INSERT INTO publications (typesPublications_id, title, description, user_id, image, availability) VALUES (?, ?, ?, ?, ?, ?)',
            [2, title, description, user_id, `/upload/${imageName}`, availability]
        );
        const publication_id = result.insertId;

        let reasons = [];

        if (isReportableCommentPeticio(titleAnalysisPeticio))
            reasons.push(`titul: ${titleAnalysisPeticio.reason}`);

        if (isReportableCommentPeticio(descriptionAnalysisPeticio))
            reasons.push(`descripció: ${descriptionAnalysisPeticio.reason}`);

        if (imageAnalysisPeticio.category === 'OFENSIVA' || (imageAnalysisPeticio.category === 'POTENCIALMENTE_SUGERENTE' && imageAnalysisPeticio.subcategory === 'OFENSIVO'))
            reasons.push(`imatge: ${imageAnalysisPeticio.reason}`);

        if (reasons.length > 0) {
            const notificationDescription = `S'ha generat un report en aquesta petició: ${publication_id}. Reasons: ${reasons.join(', ')}`;

            await connection.execute(
                `INSERT INTO reportspublications (publication_id, user_id, report, status) VALUES (?, ?, ?, ?)`,
                [publication_id, user_id, report, 'pending']
            );

            const notificationPayload = {
                user_id,
                description: notificationDescription,
                request_id: publication_id,
                report_id: publication_id,
            };
            try {
                const fetchPromise = await import('node-fetch');
                const fetch = fetchPromise.default;

                const notificationResponse = await fetch('http://localhost:3008/notifications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(notificationPayload),
                });

                if (!notificationResponse.ok) {
                    console.error("Error al enviar la notificación:", await notificationResponse.text());
                }
            } catch (notificationError) {
                console.error("Error al realizar el fetch de la notificación:", notificationError);
            }
        }

        res.status(201).json({
            message: 'Peticio created successfully',
            publicationID: result.insertId,
            titleAnalysisPeticio,
            descriptionAnalysisPeticio,
            imageAnalysisPeticio
        });
        connection.end();
    } catch (error) {
        fs.unlink(imagePath, () => { }); // Limpieza
        res.status(500).json({ error: 'Error al guardar la publicación en la base de datos.', details: error.message });
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