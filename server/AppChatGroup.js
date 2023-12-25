const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

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

    io.sockets.emit('server_respond_rooms', Array.from(io.sockets.adapter.rooms).map((item) => item[0]))

    socket.on('client_create_room', (data) => {
        console.log(data)
        socket.join(data);
        socket.phong = data;
        socket.emit('server_respond_ownroom', socket.phong)
        io.sockets.emit('server_respond_rooms', Array.from(io.sockets.adapter.rooms).map((item) => item[0]))
    })


    socket.on('client_join_room', (roomName) => {
        console.log({roomName})
        socket.join(roomName);
        socket.phong = roomName;
        socket.broadcast.in(roomName).emit('server_response_noti', `${socket.id} has just joined`);
        socket.emit('server_respond_ownroom', roomName)
    })

    socket.on('client_send_mess_room', (message) => {
        io.sockets.in(socket.phong).emit('server_response_mess_room', message)
    })

    socket.on('disconnect', () => {
    })
})

server.listen(5000, () => console.log(`listening on port ${5000}`));
