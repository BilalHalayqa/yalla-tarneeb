import React, { useState, useContext, useEffect, Fragment } from 'react';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import Spinner from '../layout/Spinner';

const Login = (props) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { setAlert } = alertContext;
  const { login, error, clearErrors, isAuthenticated, loading } = authContext;

  useEffect(() => {
    // Redirect to the home page in case there is a token
    if (isAuthenticated) {
      props.history.push('/season');
    }
    if (error === 'Invalid Credentials') {
      setAlert(error, 'danger');
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const { email, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      setAlert('Please fill in all fields', 'danger');
    } else {
      login({
        email,
        password,
      });
    }
  };

  return (
    <div className='container'>
      {!loading ? (
        <Fragment>
          <h1 className='center'>Account Login</h1>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className='form-group'>
              <label htmlFor='email'>Email Address</label>
              <input
                className='input-field validate white-text'
                id='email'
                type='email'
                name='email'
                value={email}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                className='input-field validate white-text'
                id='password'
                type='password'
                name='password'
                value={password}
                onChange={(e) => onChange(e)}
                required
              />
            </div>
            <div className='row'>
              <input
                type='submit'
                value='Login'
                className='btn white-text col s12'
              />
            </div>
          </form>
        </Fragment>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Login;
