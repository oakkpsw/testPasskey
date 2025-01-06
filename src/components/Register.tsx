import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { startRegistration } from '@simplewebauthn/browser';

const Register: React.FC = () => {
  const [userID, setUserID] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      // Request registration options from the server
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: AxiosResponse<any> = await axios.post(
        'http://localhost:3300/register',
        {
          username,
        },
        { withCredentials: true } // Important: Ensures cookies are sent and stored
      );

      console.log('Registration Options from Server:', response.data);
      const optionsJSON = {
        optionsJSON: response.data,
      };

      const attestationResponse = await startRegistration(optionsJSON);

      // Send the credential to the server for verification
      const verificationResponse = await axios.post(
        'http://localhost:3300/registerFinish',
        attestationResponse,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      console.log('Verification Response:', verificationResponse.data);

      if (verificationResponse.data.verified) {
        setMessage('Registration successful!');
      } else {
        setMessage('Registration failed: ');
      }
    } catch (error) {
      console.error(error);
      setMessage('Registration failed.');
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
    </div>
  );
};

export default Register;
