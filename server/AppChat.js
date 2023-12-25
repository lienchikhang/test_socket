const express = require('express');
const cors = require('cors');
const {Server} = require('socket.io');
const { Socket } = require('dgram');
const users = ['a'];
const messages = [];

const app = express();
const server = require('http').createServer(app);

app.use(express.static('./public')); // khi ngdung send request truy cap file trong public => no se tu vao public ma tim
app.use(cors());

app.get('/home', (req, res) => {
    res.send('home')
})

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', ['POST']]
    }
})

io.on('connection', (socket) => {
    console.log(`connected ${socket.id}`)
    socket.on('disconnect', () => {
        console.log(`disconnect ${socket.id}`)
    })

    socket.emit('server_curUsers_response', users);

    socket.on('client_login_message', (user) => {
        console.log(user)
        if(users.indexOf(user) !== -1) {
            socket.emit('server_login_message_fail');
        }
        else {
            socket.username = user;
            users.push(user);
            socket.emit('server_login_message_success', socket.username)
            io.sockets.emit('server_login_message_users', users)
        }
        
    })

    socket.on('client_send_message', (data) => {
        messages.push(data)
        socket.broadcast.emit('server_messages_respond', messages)
    })

    socket.on('client_typing', () => {
        console.log('co nguoi dang go chu')
        socket.broadcast.emit('server_typing_respond')
    })

    socket.on('client_not_typing', () => {
        console.log('khong go chu')
        socket.broadcast.emit('server_not_typing_respond')
    })

    socket.on('logout', () => {
        users.splice(users.indexOf(socket.username), 1);
        socket.broadcast.emit('server_login_message_users', users)
    })




})




server.listen(5000, () => {
    console.log(`listening on port ${5000}`)
})
