import React, { useState, useContext, useEffect, Fragment } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import SeasonContext from '../../../../context/season/seasonContext';
import AlertContext from '../../../../context/alert/alertContext';
import Confirmation from '../../../layout/Confirmation';

const DeleteSeason = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const seasonContext = useContext(SeasonContext);
  const { deleteSeason, currentSeason, modalLoading } = seasonContext;

  useEffect(() => {
    if (currentSeason) {
      setSeasonNumber(currentSeason.number);
    } else {
      setSeasonNumber('');
    }
  }, [currentSeason]);

  // Form State
  const [seasonNumber, setSeasonNumber] = useState('');

  // On submitting deleting a season
  const onDeleteSeason = (e) => {
    e.preventDefault();

    deleteSeason(currentSeason._id, function (status, message = null) {
      // error
      if (status !== 200) {
        setAlert(message, 'danger');
        return false;
      }
      // Success
      setAlert('Season was deleted successfully', 'success');
      // Close
      CloseModal();
    });
  };

  // Clear modal and currentSeason
  const CloseModal = () => {
    // Close modal
    var elem = document.getElementById('delete-season-modal');
    var instance = M.Modal.getInstance(elem);
    instance.close();
  };

  return (
    <div>
      <Fragment>
        <Confirmation
          modalLoading={modalLoading}
          id={'delete-season-modal'}
          title={'Delete Season'}
          message={
            'Are you sure you want to delete season ' + seasonNumber + ' ?'
          }
          confirm={(e) => onDeleteSeason(e)}
          closed={(e) => CloseModal(e)}
        />
      </Fragment>
    </div>
  );
};

export default DeleteSeason;
