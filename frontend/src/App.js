import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendLink = 'http://localhost:6000';
const authLink = 'http://localhost:4000';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const setupBackend = async () => {
    try {
      await axios.get(`${backendLink}/setup`);
      setMessage('Backend setup successful');
    } catch (error) {
      handleRequestError(error, 'Backend setup');
    }
  };

  const setupAuth = async () => {
    try {
      await axios.get(`${authLink}/setup`);
      setMessage('Authentication setup successful');
    } catch (error) {
      handleRequestError(error, 'Authentication setup');
    }
  };

  const handleRequestError = (error, operation) => {
    setMessage(`${operation} failed. Error: ${error.message}`);
  };

  const getAllLetters = async () => {
    try {
      const response = await axios.get(`${backendLink}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Add this line
      });
      setMessage(JSON.stringify(response.data));
    } catch (error) {
      handleRequestError(error, 'Get All Letters');
    }
  };

  const addLetter = async () => {
    try {
      await axios.post(
        `${backendLink}/`,
        {
          name: 'John Doe',
          country: 'USA',
          content: 'For Christmas, I just want people to know who I am!',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Add this line
        }
      );
      setMessage('Letter added successfully');
    } catch (error) {
      handleRequestError(error, 'Add Letter');
    }
  };

  const registerUser = async () => {
    try {
      await axios.post(
        `${authLink}/register`,
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage('User registered successfully');
    } catch (error) {
      handleRequestError(error, 'Register User');
    }
  };

  const loginUser = async () => {
    try {
      const response = await axios.post(
        `${authLink}/login`,
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setToken(response.data.token);
      setMessage('Login successful');
    } catch (error) {
      handleRequestError(error, 'Login');
    }
  };

  useEffect(() => {
    // Uncomment and run these setup functions if you want to initialize the backend and authentication tables
    // setupBackend();
    // setupAuth();
  }, []);

  return (
    <div>
      <h1>Authentication and Backend Example</h1>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <button onClick={registerUser}>Register User</button>
        <button onClick={loginUser}>Login</button>
      </div>
      <div>
        <button onClick={setupBackend}>Setup Backend</button>
        <button onClick={setupAuth}>Setup Authentication</button>
      </div>
      {token && (
        <div>
          <h2>Token:</h2>
          <p>{token}</p>
          <button onClick={getAllLetters}>Get All Letters</button>
          <button onClick={addLetter}>Add Letter</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
