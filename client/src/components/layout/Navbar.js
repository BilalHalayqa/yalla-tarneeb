import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as RNavbar, Icon } from 'react-materialize';
import AuthContext from '../../context/auth/authContext';

const Navbar = () => {
  const authContext = useContext(AuthContext);

  const { isAuthenticated, logout, user, loadUser } = authContext;

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const onLogout = (e) => {
    e.preventDefault();
    logout();
  };
  let firstname = '';
  if (user) {
    let spaceIndex = user.name.indexOf(' ');
    firstname = spaceIndex === -1 ? user.name : user.name.substr(0, spaceIndex);
  }

  return (
    <RNavbar
      alignLinks='right'
      className='blue-grey darken-2'
      brand={
        <Link to='/' className='brand-logo'>
          Yalla
          <img src='/logo.png' alt='Yalla Tarneeb' className='logo' />
          Tarneeb
        </Link>
      }
      centerChildren
      id='mobile-nav'
      menuIcon={<Icon>menu</Icon>}
      options={{
        draggable: true,
        edge: 'left',
        inDuration: 250,
        onCloseEnd: null,
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        outDuration: 200,
        preventScrolling: true,
      }}
    >
      {isAuthenticated && (
        <span style={{ paddingRight: '10px', textAlign: 'center' }}>
          Hello <strong>{user && firstname}</strong>
        </span>
      )}
      {!isAuthenticated && (
        <Link className='sidenav-close' to='/'>
          Home
        </Link>
      )}
      {
        <Link className='sidenav-close' to='/about'>
          About
        </Link>
      }
      {
        <Link className='sidenav-close' to='/player'>
          Player
        </Link>
      }
      {isAuthenticated && (
        <Link className='sidenav-close' to='/season'>
          Season
        </Link>
      )}
      {isAuthenticated && (
        <a className='sidenav-close' href='#!' onClick={(e) => onLogout(e)}>
          <i className='material-icons left'>exit_to_app</i>
          Logout
        </a>
      )}
      {!isAuthenticated && (
        <Link className='sidenav-close' to='/login'>
          Login
        </Link>
      )}
    </RNavbar>
  );
};

export default Navbar;
