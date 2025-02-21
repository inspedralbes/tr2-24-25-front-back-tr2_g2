const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const PORT = 24841;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type"],
    }
});

app.use(express.json());

app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type"],
}));

mongoose.connect( "mongodb+srv://a23cliferand:Jupiter1@cluster0.f8wpt.mongodb.net/", { dbName: 'Chat' })
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

const Message = mongoose.model('Message', messageSchema);

const checkAndInsertData = async () => {
  try {
    const count = await Message.countDocuments();
    if (count === 0) {
      const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../data/chatDataExample.json'), 'utf8'));
      const sanitizedData = data.map(({ _id, ...rest }) => rest);
      await Message.insertMany(sanitizedData);
      console.log('Datos insertados en la base de datos');
    } else {
      const messages = await Message.find();
      console.log('Datos existentes en la base de datos:', messages);
    }
  } catch (err) {
    console.error('Error al verificar o insertar datos:', err);
  }
};

checkAndInsertData();

app.get('/getChats', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/getChats/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const messages = await Message.find();
    const filteredMessages = messages.filter(message => message.user_one_id == id || message.user_two_id == id);
    ('ID:', id);
    console.log('Messages:', filteredMessages);
    res.json(filteredMessages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/getChat/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const messages = await Message.find({ _id: id });
    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/addChat', async (req, res) => {
  console.log('addChat')
  const { _id, user_one_id, user_two_id, interactions } = req.body;
  console.log('req.body:', req.body);
  try {
    let message;
    if (_id) {
      message = await Message.findByIdAndUpdate(_id, { user_one_id, user_two_id, interactions }, { new: true, upsert: true });
    } else {
      message = new Message({ user_one_id, user_two_id, interactions });
      await message.save();
    }
    res.json(message);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/newChat', async (req, res) => {
  console.log('newChat')
  const { _id, user_one_id, user_two_id, interactions } = req.body;
  const existingChat = await Message.findOne({
    $or: [
      { user_one_id: user_one_id, user_two_id: user_two_id },
      { user_one_id: user_two_id, user_two_id: user_one_id }
    ]
  });

  if (existingChat) {
    return res.status(400).send('A chat between these users already exists');
  }
  try {
      message = new Message({ user_one_id, user_two_id, interactions });
      await message.save();
      res.json(message);
  } catch (err) {
    res.status(500).send(err);
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('sendMessage', async (data) => {
    console.log('sendMessage:', data);
    const { chatId, userId, message } = data;
    const newMessage = {
      userId,
      message,
      timestamp: new Date()
    };

    try {
      const chat = await Message.findById(chatId);
      if (chat) {
        chat.interactions.push(newMessage);
        await chat.save();
        io.emit('receiveMessage', newMessage);
        console.log('Message saved:', newMessage);
      }
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});