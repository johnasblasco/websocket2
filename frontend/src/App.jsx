import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
      const [users, setUsers] = useState([]);

      useEffect(() => {
            socket.on('users', (data) => {
                  setUsers(data);
            });
      }, []);

      const handleDelete = (userId) => {
            socket.emit('delete', userId);
      };

      return (
            <div>
                  <h1>Users</h1>
                  <ul>
                        {users.map((user) => (
                              <li key={user.id}>
                                    {user.name}
                                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                              </li>
                        ))}
                  </ul>
            </div>
      );
}

export default App;