import { useState } from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ attemptLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    attemptLogin(username, password);
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        username
        <input
          type="text"
          name="username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        password
        <input
          type="text"
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button id="loginBtn" type="submit">login</button>
    </form>
  );
};

LoginForm.propTypes = {
  attemptLogin: PropTypes.func.isRequired,
};

export default LoginForm;
