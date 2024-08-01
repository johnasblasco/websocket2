import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3500');

function App() {
      const [users, setUsers] = useState([]);

      useEffect(() => {
            // Handle incoming socket events
            socket.on('users', (users) => {
                  console.log('Received users from server:', users);
                  setUsers(users);
            });

            socket.on('newUser', (user) => {
                  console.log('Received new user:', user);
                  setUsers((prevUsers) => [...prevUsers, user]);
            });

            socket.on('updatedUser', (user) => {
                  console.log('Received updated user:', user);
                  setUsers((prevUsers) => {
                        return prevUsers.map((prevUser) => prevUser._id === user._id ? user : prevUser);
                  });
            });

            socket.on('deletedUser', (user) => {
                  console.log('Received deleted user:', user);
                  setUsers((prevUsers) => {
                        console.log('Users state before update:', prevUsers);
                        const updatedUsers = prevUsers.filter((prevUser) => prevUser._id !== user.id);
                        console.log('Users state after update:', updatedUsers);
                        return updatedUsers;
                  });
            });

            return () => {
                  socket.off('users');
                  socket.off('newUser');
                  socket.off('updatedUser');
                  socket.off('deletedUser');
            };
      }, []);

      const addButton = () => {
            const newUser = {
                  name: 'hehe',
                  age: 20,
                  gender: 'ale'
            };
            axios.post("http://localhost:3500/user", newUser)
                  .then(res => {
                        console.log("Successfully created:", res.data);
                        socket.emit('newUser', res.data); // Emit a newUser event to the server
                  })
                  .catch(err => console.log("Error creating user:", err));
      };

      const DeleteButton = (user) => {
            console.log('Deleting user:', user._id);
            axios.delete(`http://localhost:3500/user/${user._id}`)
                  .then(res => {
                        console.log("Delete done:", res.data);
                        socket.emit('deletedUser', { id: user._id }); // Emit only the ID
                  })
                  .catch(err => console.log("Error deleting user:", err));
      };

      return (
            <div>
                  <h1>Users!</h1>
                  <ul>
                        {users.map((user) => (
                              <li key={user._id}>
                                    {user.name}
                                    <button onClick={() => DeleteButton(user)} className='bg-red-500 rounded-xl p-1 text-white'>DELETE</button>
                              </li>
                        ))}
                  </ul>

                  {/* actions */}
                  <h1 className='bg-red-400 text-center mb-10'>ACTIONS HERE</h1>

                  <div className='flex justify-center items-center'>
                        <button className='bg-green-500 rounded-xl p-1 text-white' onClick={addButton}>ADD</button>
                  </div>
            </div>
      );
}

export default App;
