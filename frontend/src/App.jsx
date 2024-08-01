import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3500');

function App() {
      const [users, setUsers] = useState([]);

      useEffect(() => {
            // Set up socket event listeners
            socket.on('users', (users) => setUsers(users));

            socket.on('newUser', (user) => setUsers((prevUsers) => [...prevUsers, user]));

            socket.on('updatedUser', (user) => setUsers((prevUsers) =>
                  prevUsers.map((prevUser) => prevUser._id === user._id ? user : prevUser)
            ));

            socket.on('deletedUser', (user) => setUsers((prevUsers) =>
                  prevUsers.filter((prevUser) => prevUser._id !== user.id)
            ));


            // Clean up event listeners on unmount
            return () => {
                  socket.off('users');
                  socket.off('newUser');
                  socket.off('updatedUser');
                  socket.off('deletedUser');
            };
      }, []);

      const addButton = () => {
            const newUser = { name: 'hehe', age: 20, gender: 'ale' };
            axios.post("http://localhost:3500/user", newUser)
                  .then(res => socket.emit('newUser', res.data))
                  .catch(err => console.error("Error creating user:", err));

            console.log(users)
      };

      const DeleteButton = (user) => {
            axios.delete(`http://localhost:3500/user/${user._id}`)
                  .then(() => socket.emit('deletedUser', { id: user._id }))
                  .catch(err => console.error("Error deleting user:", err));
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

                  <h1 className='bg-red-400 text-center mb-10'>ACTIONS HERE</h1>

                  <div className='flex justify-center items-center'>
                        <button className='bg-green-500 rounded-xl p-1 text-white' onClick={addButton}>ADD</button>
                  </div>
            </div>
      );
}

export default App;
