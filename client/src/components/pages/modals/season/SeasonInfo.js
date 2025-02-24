import React, { useContext, Fragment } from 'react';
import SeasonContext from '../../../../context/season/seasonContext';
import Confirmation from '../../../layout/Confirmation';

const SeasonInfo = () => {
  const seasonContext = useContext(SeasonContext);
  const { currentSeason } = seasonContext;

  return (
    <div>
      <Fragment>
        <Confirmation
          id={'season-info-modal'}
          title={'Season info'}
          message={generateSeasonInfo(currentSeason)}
        />
      </Fragment>
    </div>
  );
};

function generateSeasonInfo(season) {
  let message = '';
  if (season) {
    if (season.games_with_teams)
      message +=
        'Teams play each others ' + season.games_with_teams + ' times. ';
    if (season.playoffs)
      message +=
        'And the playoffs are for the top ' + season.playoffs + ' teams. ';
    if (season.playoffs_type)
      message +=
        'Teams in the playoffs round are generated : ' +
        (season.playoffs_type === 1 ? 'First plays last.' : 'Randomly.');
  }
  return message;
}

export default SeasonInfo;
