import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import userRoutes, { init } from './routes/userRoutes.js';
import axios from 'axios';
import cors from 'cors';

const app = express();
const server = createServer(app);

const io = new Server(server, { cors: { origin: '*' } });
app.use(cors());


app.use(express.json());
app.use('/user', userRoutes);

io.on('connection', (socket) => {
  console.log('Client connected');

  // Send initial data to new client
  async function sendInitialData() {
    try {
      const userData = await axios.get('http://localhost:3500/user');
      socket.emit('users', userData.data);
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  sendInitialData();

  socket.on('delete', (userId) => {
    // Update the users array and emit the updated data to all clients
    users = users.filter((user) => user.id !== userId);
    io.emit('users', users);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

init(io);

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb+srv://johnasblasco:XJqJKdAYkUHtvMBM@cluster0.bxlnnpb.mongodb.net/BookStore?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to the database');

    server.listen(3500, () => {
      console.log('Server listening on port 3500');
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

connectToDatabase();