import React, { Fragment, useContext } from 'react';
import AuthContext from '../../../context/auth/authContext';
import { Button } from 'react-materialize';
import PropTypes from 'prop-types';
import Moment from 'moment';
import SeasonTeams from './SeasonTeams';
import SeasonGames from './SeasonGames';

const SeasonItem = ({ season }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;

  const { status, teams, games, created_date } = season;

  let view = 'Nothing to show !';
  switch (status) {
    // In Progress
    // Complated
    case 0:
    case 1:
      view = (
        <Fragment>
          <div className='row'>
            <div className='col s12 season-item-btns'>
              {/* Delete Season Modal */}
              {isAuthenticated && (
                <Button
                  href='#delete-season-modal'
                  node='a'
                  className='modal-trigger btn red accent-2 button-delete left'
                >
                  Delete Season
                </Button>
              )}
              {/* Finish Season Modal */}
              {isAuthenticated && status !== 1 && (
                <Button
                  href={'#update-season-status-modal'}
                  node='a'
                  className={'modal-trigger btn teal darken-3 left'}
                >
                  {season.remaining_games === -1
                    ? 'Start Playoffs'
                    : season.remaining_games !== 0
                    ? 'Next Round'
                    : 'Finish Season'}
                </Button>
              )}
            </div>
          </div>

          {/* Current season games */}
          <SeasonGames games={games} status={status} />
        </Fragment>
      );
      break;
    // Created
    default:
      view = (
        <Fragment>
          <div className='row'>
            <div className='col s12 season-item-btns'>
              {/* Delete Season Modal */}
              {isAuthenticated && (
                <Button
                  href='#delete-season-modal'
                  node='a'
                  className='modal-trigger btn red accent-2 button-delete left'
                >
                  Delete Season
                </Button>
              )}
              {/* Begin Season Modal */}
              {isAuthenticated && (
                <Button
                  href={'#update-season-status-modal'}
                  node='a'
                  className={'modal-trigger btn blue accent-2 left'}
                >
                  Begin Season
                </Button>
              )}
              {/* Add Team Modal */}
              {isAuthenticated && (
                <Button
                  href='#add-team-modal'
                  node='a'
                  className='modal-trigger btn teal-grey right'
                >
                  Add Team
                </Button>
              )}
              {/* Current season teams */}
            </div>
          </div>
          <SeasonTeams teams={teams} />
        </Fragment>
      );
      break;
  }

  return (
    <div>
      <br />
      {/* Date and Status */}
      <div className='season-item row col s12'>
        <div className='badge blue-grey darken-2 white-text left'>
          <i
            href='#season-info-modal'
            className='material-icons  blue-grey darken-2 modal-trigger'
          >
            live_help
          </i>
          <strong>{Moment(created_date).format('DD MMM YYYY')}</strong>
        </div>
        <div className='season-status badge blue-grey darken-2 white-text right'>
          {status === -1 ? (
            <span className={'white-text badge red accent-2'}>Not Started</span>
          ) : status === 0 ? (
            <span className={'white-text badge blue darken-3'}>Running</span>
          ) : (
            <span className={'white-text badge teal darken-3'}>Completed</span>
          )}
        </div>
      </div>
      <br />
      <br />
      {view}
    </div>
  );
};

SeasonItem.propTypes = {
  season: PropTypes.object.isRequired,
};

export default SeasonItem;
