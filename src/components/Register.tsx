import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { startRegistration } from '@simplewebauthn/browser';

const Register: React.FC = () => {
  // const [userID, setUserID] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const domain = import.meta.env.VITE_HOST_DOMAIN || 'http://localhost:3300';

  const handleRegister = async () => {
    try {
      // Request registration options from the server
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(domain);
      const res: AxiosResponse<any> = await axios.post(
        `${domain}/register`,
        {
          username,
        },
        { withCredentials: true } // Important: Ensures cookies are sent and stored
      );
      // // Check the session in the response
      // if (response.data.session) {
      //   console.log('Session:', response.data.session);
      // } else {
      //   console.log('No session returned from server');
      // }
      const { options, challengeToken } = res.data;
      console.log('option:', options);
      console.log('challengeToken:', challengeToken);

      console.log('Registration Options from Server:', res.data);
      const optionsJSON = {
        optionsJSON: options,
      };

      const attestationResponse = await startRegistration(optionsJSON);

      // Send the credential to the server for verification
      const verificationResponse = await axios.post(
        `${domain}/registerFinish`,
        {
          body: {
            registrationResponse: attestationResponse,
            challengeToken,
          },
        },
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
      setMessage('Registration failed: ' + error);
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
