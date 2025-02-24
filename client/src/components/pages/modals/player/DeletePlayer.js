import React, { Fragment, useContext, useEffect, useState } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import Confirmation from '../../../layout/Confirmation';
import PlayerContext from '../../../../context/player/playerContext';
import AlertContext from '../../../../context/alert/alertContext';

// Delete Player
const DeletePlayer = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const playerContext = useContext(PlayerContext);
  const { current, deletePlayer, clearCurrent, modalLoading } = playerContext;

  useEffect(() => {
    if (current) {
      setName(current.name);
      return;
    }
  }, [current]);

  const [name, setName] = useState('');

  // On submitting deleting a player
  const onDeletePlayer = (e) => {
    e.preventDefault();
    if (current) {
      deletePlayer(current._id, function (status, message = null) {
        // error
        if (status !== 200) {
          setAlert(message, 'danger');
          return false;
        } else {
          setAlert(`Deleted ${current.name} !`, 'success');
          clear();
        }
      });
    }
  };

  // Clear modal and current
  const clear = (e) => {
    // Close modal
    var elem = document.getElementById('delete-player-modal');
    var instance = M.Modal.getInstance(elem);
    instance.close();

    setName('');
    clearCurrent();
  };

  return (
    <div>
      <Fragment>
        <Confirmation
          modalLoading={modalLoading}
          id={'delete-player-modal'}
          title={'Delete Player'}
          message={'Are you sure you want to delete the player ' + name + ' ?'}
          confirm={(e) => onDeletePlayer(e)}
          closed={(e) => clear(e)}
        />
      </Fragment>
    </div>
  );
};

export default DeletePlayer;
