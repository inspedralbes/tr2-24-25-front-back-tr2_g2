const fileUpload = require('express-fileupload');
const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express());
app.use(cors());
app.use(fileUpload());

app.use('/upload', express.static(path.join(__dirname, 'upload')));


// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});