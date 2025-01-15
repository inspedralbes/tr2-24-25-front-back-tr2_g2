const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin"],
}));

app.get('/', (req, res) => {
    res.send('Hello World! XDDDDDDDDDDDDDDD I am a stadistics service');
});

app.use('/upload/comments', express.static(path.join(__dirname, 'python/images/statisctics/comments')));
app.use('/upload/publications', express.static(path.join(__dirname, 'python/images/statisctics/publications')));
app.use('/upload/users', express.static(path.join(__dirname, 'python/images/statisctics/users')));

app.get('/images', (req, res) => {
    const commentsDir = path.join(__dirname, 'python/images/statisctics/comments');
    const publicationsDir = path.join(__dirname, 'python/images/statisctics/publications');
    const usersDir = path.join(__dirname, 'python/images/statisctics/users');

    const getImages = (dir) => {
        try {
            if (!fs.existsSync(dir)) {
                console.error(`Directory ${dir} does not exist.`);
                return [];
            }
            return fs.readdirSync(dir).map(file => path.join(dir, file));
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error);
            return [];
        }
    };

    const images = {
        comments: getImages(commentsDir),
        publications: getImages(publicationsDir),
        users: getImages(usersDir)
    };

    res.json(images);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});