/* ----------------------------------------- IMPORTS ----------------------------------------- */
const fileUpload = require('express-fileupload');
const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

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

/* ----------------------------------------- SOCKETS ----------------------------------------- */
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        allowedHeaders: ["Access-Control-Allow-Origin"],
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

/* ----------------------------------------- ROUTES ----------------------------------------- */
// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World! XDDDDDDDDDDDDDDD');
});

app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Register route
app.post('/register', async (req, res) => {
    const { name, email, password, typesUsers_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO users (name, email, password, typesUsers_id) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, typesUsers_id]
        );
        connection.end();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        connection.end();

        if (rows.length == 0) return res.status(400).json({ error: 'User not found' });

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Invalid password' });

        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for users
app.get('/users', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'User not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, typesUsers_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE users SET name = ?, email = ?, password = ?, typesUsers_id = ? WHERE id = ?',
            [name, email, hashedPassword, typesUsers_id, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for newDataUsers
app.get('/newDataUsers', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM newDataUsers');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/newDataUsers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM newDataUsers WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'User not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/newDataUsers', async (req, res) => {
    const { typesUsers_id, user_id, name, email, password, token, banner, profile, status, class_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO newDataUsers (typesUsers_id, user_id, name, email, password, token, banner, profile, status, class_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [typesUsers_id, user_id, name, email, hashedPassword, token, banner, profile, status, class_id]
        );
        connection.end();
        res.status(201).json({ message: 'New data user created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/newDataUsers/:id', async (req, res) => {
    const { id } = req.params;
    const { typesUsers_id, user_id, name, email, password, token, banner, profile, status, class_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE newDataUsers SET typesUsers_id = ?, user_id = ?, name = ?, email = ?, password = ?, token = ?, banner = ?, profile = ?, status = ?, class_id = ? WHERE id = ?',
            [typesUsers_id, user_id, name, email, hashedPassword, token, banner, profile, status, class_id, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'New data user updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/newDataUsers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM newDataUsers WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'User not found' });

        res.json({ message: 'New data user deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for qualifications
app.get('/qualifications', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM qualifications');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/qualifications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM qualifications WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'Qualification not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/qualifications', async (req, res) => {
    const { name } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO qualifications (name) VALUES (?)',
            [name]
        );
        connection.end();
        res.status(201).json({ message: 'Qualification created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/qualifications/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE qualifications SET name = ? WHERE id = ?',
            [name, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Qualification not found' });

        res.json({ message: 'Qualification updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/qualifications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM qualifications WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Qualification not found' });

        res.json({ message: 'Qualification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for usersQualifications
app.get('/users/qualifications', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM usersQualifications');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/users/qualifications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM usersQualifications WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'UserQualification not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/users/qualifications', async (req, res) => {
    const { user_id, qualification_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO usersQualifications (user_id, qualification_id) VALUES (?, ?)',
            [user_id, qualification_id]
        );
        connection.end();
        res.status(201).json({ message: 'UserQualification created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/users/qualifications/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, qualification_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE usersQualifications SET user_id = ?, qualification_id = ? WHERE id = ?',
            [user_id, qualification_id, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'UserQualification not found' });

        res.json({ message: 'UserQualification updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/users/qualifications/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM usersQualifications WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'UserQualification not found' });

        res.json({ message: 'UserQualification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for classes
app.get('/classes', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM classes');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/classes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM classes WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'Class not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/classes', async (req, res) => {
    const { name } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO classes (name) VALUES (?)',
            [name]
        );
        connection.end();
        res.status(201).json({ message: 'Class created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/classes/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE classes SET name = ? WHERE id = ?',
            [name, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Class not found' });

        res.json({ message: 'Class updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/classes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM classes WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'Class not found' });

        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for teachersClasses
app.get('/teachersClasses', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM teachersClasses');
        connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/teachersClasses/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM teachersClasses WHERE id = ?', [id]);
        connection.end();

        if (rows.length == 0) return res.status(404).json({ error: 'TeacherClass not found' });

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/teachersClasses', async (req, res) => {
    const { user_id, class_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO teachersClasses (user_id, class_id) VALUES (?, ?)',
            [user_id, class_id]
        );
        connection.end();
        res.status(201).json({ message: 'TeacherClass created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/teachersClasses/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, class_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE teachersClasses SET user_id = ?, class_id = ? WHERE id = ?',
            [user_id, class_id, id]
        );
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'TeacherClass not found' });

        res.json({ message: 'TeacherClass updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/teachersClasses/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM teachersClasses WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows == 0) return res.status(404).json({ error: 'TeacherClass not found' });

        res.json({ message: 'TeacherClass deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for reports comments
app.get('/reports/comments', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute('SELECT * FROM reportsComments');
        connection.end();

        res.status(200).send(results);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/reports/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('SELECT * FROM reportsComments WHERE id = ?', [id]);
        connection.end();

        if (result.length === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(200).send(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/reports/comments', async (req, res) => {
    const { comment_id, user_id, report } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('INSERT INTO reportsComments (comment_id, user_id, report) VALUES (?, ?, ?)', [comment_id, user_id, report]);
        connection.end();

        res.status(201).send({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/reports/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('UPDATE reportsComments SET status = ? WHERE id = ?', [status, id]);
        connection.end();

        if (result.affectedRows === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(200).send({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/reports/comments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM reportsComments WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// CRUD operations for reports users
app.get('/reports/users', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute('SELECT * FROM reportsUsers');
        connection.end();

        res.status(200).send(results);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/reports/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('SELECT * FROM reportsUsers WHERE id = ?', [id]);
        connection.end();

        if (result.length === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(200).send(result[0]);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/reports/users', async (req, res) => {
    const { reported_user_id, user_id, report } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('INSERT INTO reportsUsers (reported_user_id, user_id, report) VALUES (?, ?, ?)', [reported_user_id, user_id, report]);
        connection.end();

        res.status(201).send({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/reports/users/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('UPDATE reportsUsers SET status = ? WHERE id = ?', [status, id]);
        connection.end();

        if (result.affectedRows === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(200).send({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/reports/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM reportsUsers WHERE id = ?', [id]);
        connection.end();

        if (result.affectedRows === 0) return res.status(404).send({ message: 'Report not found' });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Create users rewiews
app.post('/reviews', async (req, res) => { 
    const { reviewed_user_id, reviewer_user_id, rating } = req.body; 

    try { 
        const connection = await mysql.createConnection(dbConfig); 
        await connection.beginTransaction(); 
        const [result] = await connection.execute('INSERT INTO reviews (reviewed_user_id, reviewer_user_id, rating) VALUES (?, ?, ?)', [reviewed_user_id, reviewer_user_id, rating]); 
        
        const [rows] = await connection.execute('SELECT AVG(rating) as rating FROM reviews WHERE reviewed_user_id = ?', [reviewed_user_id]); 
        if (rows.length == 0) { 
            throw new Error('No reviews found for the user');
        } 
        const averageRating = parseFloat(rows[0].rating).toFixed(2); 

        await connection.execute('UPDATE users SET review = ? WHERE id = ?', [averageRating, reviewed_user_id]); 
        await connection.commit(); 
        connection.end(); 
        res.status(201).send({ id: result.insertId }); 
    } catch (error) { 
        console.error('Database error:', error); 
        res.status(500).json({ error: 'Database error' });
    }
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});