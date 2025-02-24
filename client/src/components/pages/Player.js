import React, { useEffect, useContext } from 'react';
import AuthContext from '../../context/auth/authContext';
import { Button } from 'react-materialize';
import Players from './players/Players';
import PlayerFilter from './players/PlayerFilter';
import AlertContext from '../../context/alert/alertContext';
import AddUpdatePlayer from './modals/player/AddUpdatePlayer';
import DeletePlayer from './modals/player/DeletePlayer';

const Player = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;

  // Clear errors on page load
  const alertContext = useContext(AlertContext);
  useEffect(() => {
    alertContext.clearAlerts();
    // eslint-disable-next-line
  }, []);

  return (
    <div className='row'>
      {/* Delete Player Modal */}
      {isAuthenticated && <DeletePlayer /> }
      {/* Add/Edit Player Modal */}
      <AddUpdatePlayer />
      <div className='col s12'>
        <br />
        {isAuthenticated && <Button
          href='#add-edit-player-modal'
          node='a'
          className='modal-trigger btn teal-grey right'
        >
          Add Player
        </Button>}
        <br />
      </div>
      <div className='col s12'>
        <PlayerFilter />
        <Players />
      </div>
    </div>
  );
};

export default Player;
