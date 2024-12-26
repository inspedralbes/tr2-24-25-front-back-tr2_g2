const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(express.json());
app.use(cors());

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
  const id = Number(req.params.id);
  try {
    const messages = await Message.find({ $or: [{ user_one_id: id }, { user_two_id: id }] });
    res.json(messages);
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

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('sendMessage', async (data) => {
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
      }
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3004, () => {
  console.log('listening on *:3004');
});