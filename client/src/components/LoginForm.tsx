import { FC, useContext, useState } from 'react';
import { Context } from '../index';

const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { store } = useContext(Context);

  return (
    <div>
      <input
        type="text"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        value={password}
      />
      <button onClick={() => store.login(email, password)}>Sign In</button>
      <button onClick={() => store.registartion(email, password)}>Sign Up</button>
    </div>
  );
};

export default LoginForm;
