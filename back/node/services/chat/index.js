const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express());
app.use(cors());

console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, { dbName: 'Chat' })
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

const messageSchema = new mongoose.Schema({
        user_one_id: Number,
        user_two_id: Number,
        interactions: [
                {
                        userId: String,
                        message: String,
                        timestamp: Date
                }
        ]
});

const Message = mongoose.model('Data', messageSchema);

app.get('/getChats', async (req, res) => {
    try {
        console.log(await Message.find())
        const messages = await Message.find();
        console.log(messages);
        res.json(messages);
    } catch (err) {
        res.status(500).send(err);
    }
});


app.get('/getChats/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        const messages = await Message.find({ $or: [{ user_one_id: id }, { user_two_id: id }] });
        console.log(messages);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.listen(3004, () => {
    console.log('listening on *: ' + 3004);
});