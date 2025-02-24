import React, { Fragment, useContext } from 'react';
import AuthContext from '../../../context/auth/authContext';
import PropTypes from 'prop-types';
import SeasonContext from '../../../context/season/seasonContext';

const SeasonTeams = ({ teams }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;

  const seasonContext = useContext(SeasonContext);
  const { setCurrentTeam } = seasonContext;

  return (
    <div className='season-teams row col s12'>
      <br />
      <br />
      {/* Fill teams */}
      {teams.map((team, index) => (
        <div
          key={index}
          className={
            'team-block card blue-grey darken-1 col s12 m5 left ' +
            (index % 2 !== 0 ? 'offset-m2' : '')
          }
        >
          <Fragment>
            {/* Delete Team */}
            {isAuthenticated && <i
              href={'#delete-team-modal'}
              className='material-icons red accent-2 right modal-trigger'
              onClick={(e) => setCurrentTeam(team)}
            >
              close
            </i>}
            {/* Team Box */}
            <div>
              <div className='card-content center title'>
                <p className='flow-text title'>{team.name}</p>
              </div>
              <div className='teams card-action blue-grey row s12'>
                <div className='col s6 center left'>
                  <p>
                    {team.player1 ? (
                      team.player1.name
                    ) : (
                      <span className='red-text text-accent-1'>
                        Player was removed !
                      </span>
                    )}
                  </p>
                </div>
                <div className='col s6 center right'>
                  <p>
                    {team.player2 ? (
                      team.player2.name
                    ) : (
                      <span className='red-text text-accent-1'>
                        Player was removed !
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Fragment>
        </div>
      ))}
    </div>
  );
};

SeasonTeams.propTypes = {
  teams: PropTypes.array.isRequired,
};

export default SeasonTeams;
