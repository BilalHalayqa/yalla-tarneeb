import React, { useEffect, useContext } from 'react';
import Seasons from './seasons/Seasons';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import DeleteSeason from '../../components/pages/modals/season/DeleteSeason';
import AddSeason from '../../components/pages/modals/season/AddSeason';
import UpdateSeasonStatus from '../../components/pages/modals/season/UpdateSeasonStatus';
import DeleteTeam from '../../components/pages/modals/season/DeleteTeam';
import AddTeam from '../../components/pages/modals/season/AddTeam';
import SeasonInfo from '../../components/pages/modals/season/SeasonInfo';
import SetGameScore from '../../components/pages/modals/season/SetGameScore';

const Season = () => {
  // Clear errors on page load
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;
  
  useEffect(() => {
    alertContext.clearAlerts();
    // eslint-disable-next-line
  }, []);

  return (
    <div className='row'>
      <div className='col s12'>
        {/* Add Season Modal */}
        {isAuthenticated && <AddSeason />}
        {/* Delete Season Modal */}
        {isAuthenticated && <DeleteSeason />}
        {/* Update Season Status Modal */}
        {isAuthenticated && <UpdateSeasonStatus />}
        {/* Season */}
        <SeasonInfo />
        {/* Delete Team Modal */}
        {isAuthenticated && <DeleteTeam />}
        {/* Add Team Modal */}
        {isAuthenticated && <AddTeam />}
        {/* Set Game Score Modal */}
        {isAuthenticated && <SetGameScore />}
        {/* Seasons list and actions */}
        <Seasons />
      </div>
    </div>
  );
};

export default Season;
