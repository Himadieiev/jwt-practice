import React, { FC, useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import LoginForm from './components/LoginForm';
import { Context } from './index';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

const App: FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  if (!store.isAuth) {
    return <LoginForm />;
  }

  return (
    <div>
      <h1>
        {store.isAuth ? `Користувач авторизован ${store.user.email} ` : 'Треба авторизуватись!'}
      </h1>
      <h1>
        {store.user.isActivated ? 'Акаунт підтверджен через пошту' : 'Треба підтвердити акаунт!'}
      </h1>
      <button onClick={() => store.logout()}>Log Out</button>
      <div>
        <button onClick={getUsers}>Get Users</button>
      </div>
      {users.map(user => (
        <div key={user.email}>{user.email}</div>
      ))}
    </div>
  );
};

export default observer(App);
