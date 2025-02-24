import React, { useContext, useEffect, Fragment } from 'react';
import AuthContext from '../../../context/auth/authContext';
import { Button } from 'react-materialize';
import SeasonItem from './SeasonItem';
import Spinner from '../../layout/Spinner';
import SeasonContext from '../../../context/season/seasonContext';
import { Tabs, Tab } from 'react-materialize';

const Seasons = () => {
  const seasonContext = useContext(SeasonContext);
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;

  const {
    seasons,
    currentSeason,
    setCurrentSeason,
    getSeasons,
    loading,
  } = seasonContext;

  useEffect(() => {
    getSeasons();
    // eslint-disable-next-line
  }, []);

  // Change current season on changing the tab
  const onTabChange = (e) => {
    var x = document.getElementsByClassName('seasons-tabs');
    for (var i = 0; i < x.length; i++) {
      // eslint-disable-next-line
      if ((' ' + x[i].className + ' ').indexOf(' ' + 'active' + ' ') > -1) {
        const currentSeasonId = x[i].classList[6].trim().replace('id-', '');
        seasons.forEach((season) => {
          if (season._id === currentSeasonId) {
            setCurrentSeason(season);
          }
        });
        break;
      }
    }
  };

  // In case there are no seasons
  if (isAuthenticated && seasons !== null && seasons.length === 0 && !loading) {
    return (
      <div className='row'>
        <br />
        <Button
          href='#add-season-modal'
          node='a'
          className='modal-trigger btn teal-grey'
        >
          Add Season
        </Button>
        <h5>Please add a season first</h5>
      </div>
    );
  }

  // Render
  return (
    <div className='row'>
      {seasons !== null && !loading ? (
        <div className='col s12'>
          <br />
          {isAuthenticated && (
            <Fragment>
              <Button
                href='#add-season-modal'
                node='a'
                className='modal-trigger btn teal-grey'
              >
                Add Season
              </Button>
              <br />
              <br />            
            </Fragment>
          )}
          {/* Seasons */}
          <Tabs className='blue-grey darken-2' onChange={(e) => onTabChange(e)}>
            {seasons
              .slice(0)
              .reverse()
              .map((season) => (
                <Tab
                  className={
                    'white-text blue-grey darken-2 seasons-tabs id-' +
                    season._id
                  }
                  active={season._id === currentSeason._id}
                  title={'Season ' + season.number}
                  key={season._id}
                >
                  <SeasonItem key={season.number} season={season} />
                </Tab>
              ))}
          </Tabs>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Seasons;
