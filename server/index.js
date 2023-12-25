const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const users = [];

const app = express();
app.use(cors());
app.use(express.static('/public'));

const server = require('http').createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`${socket.id} has connected`);

    socket.emit('server_users_response_default', users);

    socket.on('client_register', (data) => {
        users.push(data);
        io.sockets.emit('server_register_response', users);
    })

    socket.on('disconnect', () => {
    })
})

server.listen(5000, () => console.log(`listening on port ${5000}`));
