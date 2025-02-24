import React, { Fragment, useContext } from 'react';
import AuthContext from '../../../context/auth/authContext';
import PropTypes from 'prop-types';
import { Button } from 'react-materialize';
import SeasonContext from '../../../context/season/seasonContext';

const SeasonGames = ({ games, status }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;

  const seasonContext = useContext(SeasonContext);
  const { currentSeason, setCurrentGame } = seasonContext;
  games = games.sort(function (a, b) {
    return a.round - b.round;
  });

  // If Season is completed, get the winner
  let winnerDiv = '';
  if (status === 1) {
    const winner =
      currentSeason.remaining_games === -1
        ? getTopScorerTeam(currentSeason.teams)
        : getWinnerTeam(games);
    if (winner)
      winnerDiv = (
        <Fragment>
          <div className='winner card blue-grey darken-1 row center'>
            <div className='col s12 m6 teams left'>
              <i className='material-icons'>emoji_events</i>
              <span>{winner.name}</span>
            </div>
            <div className='col s12 m6 players'>
              {winner.player1.name} <br /> {winner.player2.name}
            </div>
          </div>
        </Fragment>
      );
  }

  // Is there a final flag
  let isFinalExist = false;
  games.forEach((game) => {
    if (game.round === 1) {
      isFinalExist = true;
      return true;
    }
    return false;
  });

  return (
    <div className='season-games row col s12'>
      {/* <br /> */}
      {/* Show winner of the season */}
      {winnerDiv}
      {/* <br /> */}
      {/* Fill games */}
      {games.map((game, index) => (
        <div
          key={index}
          className={
            'game-block card blue-grey darken-1 left ' +
            (game.round === 1
              ? 'col s12'
              : 'col s12 m5  ' +
                (index % 2 !== (!isFinalExist ? 0 : 1) ? 'offset-m2' : ''))
          }
        >
          <Fragment>
            {/* Set Game Score */}
            {isAuthenticated && status !== 1 && (
              <i
                href={'#set-game-score-modal'}
                className='material-icons blue-grey darken-1 right modal-trigger'
                onClick={(e) => setCurrentGame(game)}
              >
                edit
              </i>
            )}
            {/* Game Box */}
            <div className='card-content row s12'>
              <div className='game-box'>
                <div className='col s5 center'>
                  <Button
                    tooltip={
                      game.team1.player1.name.split(' ')[0] +
                      ' & ' +
                      game.team1.player2.name.split(' ')[0]
                    }
                    tooltipOptions={{
                      position: 'top',
                    }}
                  >
                    {game.team1 ? (
                      game.team1.name
                    ) : (
                      <span className='red-text text-accent-1'>
                        Team was removed !
                      </span>
                    )}
                  </Button>
                </div>
                <div className={'col s2 center score '}>
                  {game.score1 !== null && game.score2 !== null ? (
                    <Fragment>
                      <div
                        className={
                          'col s6 center score1 ' +
                          (game.score1 > game.score2
                            ? 'teal darken-1'
                            : 'red darken-1')
                        }
                      >
                        {game.score1}
                      </div>
                      <div
                        className={
                          'col s6 center score2 ' +
                          (game.score2 > game.score1
                            ? 'teal darken-1'
                            : 'red darken-1')
                        }
                      >
                        {game.score2}
                      </div>
                    </Fragment>
                  ) : (
                    <Fragment>vs</Fragment>
                  )}
                </div>

                <div className='col s5 center'>
                  <Button
                    tooltip={
                      game.team2.player1.name.split(' ')[0] +
                      ' & ' +
                      game.team2.player2.name.split(' ')[0]
                    }
                    tooltipOptions={{
                      position: 'top',
                    }}
                  >
                    <span>
                      {game.team2 ? (
                        game.team2.name
                      ) : (
                        <span className='red-text text-accent-1'>
                          Team was removed !
                        </span>
                      )}
                    </span>
                  </Button>
                </div>

                {game.round && game.round !== 999 ? (
                  <div className='round center'>{formatRound(game.round)}</div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </Fragment>
        </div>
      ))}
    </div>
  );
};

// Show round tag if there is one
function formatRound(round) {
  switch (round) {
    case -1:
      return '';
    case 1:
      return 'Final';
    case 2:
      return 'Semi Final';
    case 4:
      return 'Quarter Final';
    default:
      return 'Knockout ' + round;
  }
}

// Winner team
function getWinnerTeam(games) {
  let t1WiningTimes = 0;
  let t2WiningTimes = 0;
  let t1 = 0;
  let t2 = 0;
  games.forEach((game) => {
    if (game.round === 1) {
      t1 = game.team1;
      t2 = game.team2;
      if (game.score1 > game.score2) t1WiningTimes++;
      else t2WiningTimes++;
      return false;
    }
  });
  return t1WiningTimes > t2WiningTimes ? t1 : t2;
}

// Winner team - top scorer
function getTopScorerTeam(teams) {
  let highestScore = 0;
  let t = teams[0];
  teams.forEach((team) => {
    if (team.score > highestScore) {
      highestScore = team.score;
      t = team;
    }
    return false;
  });
  return t;
}

SeasonGames.propTypes = {
  games: PropTypes.array.isRequired,
  status: PropTypes.number.isRequired,
};

export default SeasonGames;
