const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const jwtSecret = 'Your JWT Secret';

mongoose.connect('mongodb://localhost/advanced-chat', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(express.static('public'));
app.use('/auth', authRoutes);

io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, jwtSecret, (err, decoded) => {
            if (err) return next(new Error('Authentication error'));
            socket.user = decoded;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
}).on('connection', (socket) => {
    //console.log('a user connected', socket.user.username);

    socket.on('disconnect', () => {
        //console.log('user disconnected');
    });

    socket.on('join room', (room) => {
        socket.join(room);
        //console.log(`User ${socket.user.username} joined room: ${room}`);
    });

    socket.on('chat message', async (msg) => {
        const message = new Message({
            sender: socket.user.username,
            room: msg.room,
            text: msg.text
        });
        await message.save();
        io.to(msg.room).emit('chat message', { sender: socket.user.username, text: msg.text });
    });

    socket.on('private message', async (msg) => {
        const message = new Message({
            sender: socket.user.username,
            recipient: msg.recipient,
            text: msg.text
        });
        await message.save();
        socket.to(msg.recipient).emit('private message', { sender: socket.user.username, text: msg.text });
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
