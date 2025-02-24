import React, { useContext, Fragment } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import SeasonContext from '../../../../context/season/seasonContext';
import AlertContext from '../../../../context/alert/alertContext';
import Confirmation from '../../../layout/Confirmation';

const AddSeason = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const seasonContext = useContext(SeasonContext);
  const { addSeason, modalLoading } = seasonContext;

  // On submitting adding a season
  const onAddSeason = (e) => {
    e.preventDefault();

    addSeason(function (status, message = null) {
      // error
      if (status !== 200) {
        setAlert(message, 'danger');
        return false;
      }
      // Success
      setAlert('Season was added successfully', 'success');

      // Clear and close
      clear();
    });
  };

  // Clear modal
  const clear = (e) => {
    // Close modal
    var elem = document.getElementById('add-season-modal');
    var instance = M.Modal.getInstance(elem);
    instance.close();
  };

  return (
    <div>
      <Fragment>
        <Confirmation
          id={'add-season-modal'}
          title={'Adding new season'}
          message='Are you sure you want to create a new season '
          confirm={(e) => onAddSeason(e)}
          modalLoading={modalLoading}
          closed={(e) => clear(e)}
        />
      </Fragment>
    </div>
  );
};

export default AddSeason;
