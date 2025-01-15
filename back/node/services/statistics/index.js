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
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.get('/', (req, res) => {
    res.send('Hello World! XDDDDDDDDDDDDDDD I am a stadistics service');
});

app.use('/upload/comments', express.static(path.join(__dirname, 'python/images/statistics/comments')));
app.use('/upload/publications', express.static(path.join(__dirname, 'python/images/statistics/publications')));
app.use('/upload/users', express.static(path.join(__dirname, 'python/images/statistics/users')));

app.get('/images', (req, res) => {
    const commentsDir = path.join(__dirname, 'python/images/statistics/comments');
    const publicationsDir = path.join(__dirname, 'python/images/statistics/publications');
    const usersDir = path.join(__dirname, 'python/images/statistics/users');

    console.log('Comments Directory:', commentsDir);
    console.log('Publications Directory:', publicationsDir);
    console.log('Users Directory:', usersDir);
    const getImages = (dir) => {
        try {
            if (!fs.existsSync(dir)) {
                console.error(`Directory ${dir} does not exist.`);
                return [];
            }
            const file = fs.readdirSync(dir)

            const files = fs.readdirSync(dir).filter(file =>{
                const fullPath = path.join(dir, file);
                return fs.statSync(fullPath).isFile();
            })
            console.log(files);
            
            return file.map(file => path.join('/upload', path.basename(dir), file).replace(/\\/g, '/'));
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

    console.log("aaaaaaaaaaa",images);
    
    res.json(images);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});