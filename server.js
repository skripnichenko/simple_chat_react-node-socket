const express = require('express');
const cors = require('cors');

const app = express();
const server = require('http').Server(app);
// eslint-disable-next-line react-hooks/rules-of-hooks
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
});

const rooms = new Map();

app.get('/rooms/:id', (req, res) => {
    const { id: roomId } = req.params;
    const obj = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()]
    } : { users: [], messages: [] }
    res.json(obj);
});

app.post('/rooms', (req, res) => {
    const { roomId, userName } = req.body;

    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', []]
        ]))
    }
    res.send();
})

io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({ roomId, userName }) => {
        socket.join(roomId);
        rooms.get(roomId).get('users').set(socket.id, userName);
        const users = [...rooms.get(roomId).get('users').values()];
        socket.to(roomId).emit('ROOM:SET_USERS', users);
    });

    socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
        rooms.get(roomId).get('messages').push({
            userName,
            text
        });
        socket.to(roomId).emit('ROOM:NEW_MESSAGE', { userName, text });
    })

    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()];
                socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users)
            }
        })
    })
})


server.listen(3001, (err) => {
    if (err) throw Error(err);
    console.log('server started');
});