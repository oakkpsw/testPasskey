import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { startAuthentication } from '@simplewebauthn/browser';

const Login: React.FC = () => {
  const [userID, setUserID] = useState('');
  const [message, setMessage] = useState('');
  const domain = import.meta.env.VITE_HOST_DOMAIN || 'http://localhost:3300';

  const handleLogin = async () => {
    try {
      // Request login options from the server
      const username = userID;
      // const { data: options } = await axios.post(
      //   'http://localhost:3300/login',
      //   { username: username }
      // );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(domain);
      const res: AxiosResponse<any> = await axios.post(
        `${domain}/login`,
        {
          username,
        },
        { withCredentials: true } // Important: Ensures cookies are sent and stored
      );

      // Call WebAuthn API to get credentials
      // const optionsJSON = {
      //   optionsJSON: options,
      // };
      // const optionsJSON = {
      //   optionsJSON: response.data,
      // };
      console.log('res', res);
      const { options, challengeToken } = res.data;
      console.log('option:', options);
      console.log('challengeToken:', challengeToken);

      const optionsJSON = {
        optionsJSON: options,
      };
      const payload = 'Your secure message or data';

      const asseResp = await startAuthentication(optionsJSON);
      // Send the assertion to the server for verification
      console.log(asseResp);
      await axios.post(
        `${domain}/verify-login`,
        {
          username,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            asseResp,
            payload,
            challengeToken,
          },
        },
        { withCredentials: true }
      );

      setMessage('Login successful!');
    } catch (error) {
      console.error(error);
      setMessage('Login failed.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="User ID"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  );
};

export default Login;
