import React, { useState, useContext, useEffect, Fragment } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import SeasonContext from '../../../../context/season/seasonContext';
import AlertContext from '../../../../context/alert/alertContext';
import Confirmation from '../../../layout/Confirmation';

const DeleteSeason = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const seasonContext = useContext(SeasonContext);
  const {
    deleteTeam,
    currentTeam,
    clearCurrentTeam,
    modalLoading,
  } = seasonContext;

  useEffect(() => {
    if (currentTeam) {
      setTeamName(currentTeam.name);
    } else {
      setTeamName('');
    }
  }, [currentTeam]);

  // Form State
  const [teamName, setTeamName] = useState('');

  // On submitting deleting a team
  const onDeleteTeam = (e) => {
    e.preventDefault();

    deleteTeam(currentTeam._id, function (status, message = null) {
      // error
      if (status !== 200) {
        setAlert(message, 'danger');
        return false;
      }
      // Success
      setAlert('Team was deleted successfully', 'success');
      // Close
      CloseModal();
    });
  };

  // Clear modal and currentTeam
  const CloseModal = () => {
    // Close modal
    var elem = document.getElementById('delete-team-modal');
    var instance = M.Modal.getInstance(elem);
    instance.close();
    // Clear current
    clearCurrentTeam();
  };

  return (
    <div>
      <Fragment>
        <Confirmation
          modalLoading={modalLoading}
          id={'delete-team-modal'}
          title={'Delete Season'}
          message={'Are you sure you want to delete (' + teamName + ') team ?'}
          confirm={(e) => onDeleteTeam(e)}
          closed={(e) => CloseModal(e)}
        />
      </Fragment>
    </div>
  );
};

export default DeleteSeason;
