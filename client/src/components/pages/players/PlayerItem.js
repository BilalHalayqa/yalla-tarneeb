import React, { useContext, Fragment } from 'react';
import AuthContext from '../../../context/auth/authContext';

import PropTypes from 'prop-types';
import PlayerContext from '../../../context/player/playerContext';

const PlayerItem = ({ player }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;

  const playerContext = useContext(PlayerContext);
  const { setCurrent } = playerContext;

  const { name, nickname, email, country } = player;

  return (
    <Fragment>
      <div className='card-content'>
        {nickname && (
          <span className={'nickname white-text badge blue-grey darken-2'}>
            {nickname}
          </span>
        )}
        <h5>{name} </h5>
        <ul className='list'>
          <li>
            <i className='material-icons'>email</i>{' '}
            <a href={'mailto:' + email} className='target'>
              {email}
            </a>
          </li>
          <li>
            <i className='material-icons'>flag</i> {country}
          </li>
        </ul>
      </div>
      {isAuthenticated && <div
        className='card-action blue-grey row'
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <div
          className='col s6 center'
          style={{ borderRight: '1px solid rgb(158, 158, 158)' }}
        >
          <a
            href='#add-edit-player-modal'
            className='modal-trigger'
            onClick={() => setCurrent(player)}
          >
            Edit
          </a>
        </div>
        <div className='col s6 center'>
          <a
            href={'#delete-player-modal'}
            className='red-text text-accent-1 modal-trigger'
            onClick={() => setCurrent(player)}
          >
            Delete
          </a>
        </div>
      </div>}
    </Fragment>
  );
};

PlayerItem.propTypes = {
  player: PropTypes.object.isRequired,
};

export default PlayerItem;
