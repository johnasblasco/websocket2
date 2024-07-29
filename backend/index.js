import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

let users = [
  { id: 1, name: 'Leanne Graham' },
  { id: 2, name: 'Ervin Howell' },
  { id: 3, name: 'Ervin Howelsssl' },

];
let userApi = "https://jsonplaceholder.typicode.com/users"

io.on('connection', (socket) => {


  console.log('Client connected');

  // Send initial data to new client
  socket.emit('users', users);

  
  socket.on('delete', (userId) => {
    users = users.filter((user) => user.id !== userId);
    // Broadcast updated data to all clients
    io.emit('users', users);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });


});

app.use(express.static('public'));
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});