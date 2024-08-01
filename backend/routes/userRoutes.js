import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();
const User = mongoose.model('User', {
  name: String,
  age: Number,
  gender: String,
});

let io;

export function init(ioInstance) {
  io = ioInstance;
}

router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    io.emit('newUser', user); // Emit a new user event to all connected clients
    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating user' });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching users' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).send({ message: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      res.status(404).send({ message: 'User not found' });
    } else {
      io.emit('updatedUser', user); // Emit an updated user event to all connected clients
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    io.emit('deletedUser', { id: req.params.id }); // Emit a deleted user event to all connected clients
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting user' });
  }
});

export default router;  