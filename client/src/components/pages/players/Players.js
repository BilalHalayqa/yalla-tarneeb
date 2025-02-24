import React, { Fragment, useContext, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PlayerItem from './PlayerItem';
import Spinner from '../../layout/Spinner';
import PlayerContext from '../../../context/player/playerContext';

const Players = () => {
  const playerContext = useContext(PlayerContext);

  const { players, filtered, getPlayers, loading } = playerContext;

  useEffect(() => {
    getPlayers();
    // eslint-disable-next-line
  }, []);

  if (players !== null && players.length === 0 && !loading) {
    return <h4>Please add a player</h4>;
  }

  return (
    <Fragment>
      {players !== null && !loading ? (
        <div className='players row col s12'>
          <TransitionGroup>
            {filtered !== null
              ? filtered.map((player, index) => (
                  <CSSTransition
                    key={player._id}
                    timeout={500}
                    classNames='item'
                  >
                    <div
                      className={
                        'card blue-grey darken-1 col s12 m5 left ' +
                        (index % 2 !== 0 ? 'offset-m2' : '')
                      }
                    >
                      <PlayerItem player={player} />
                    </div>
                  </CSSTransition>
                ))
              : players.map((player, index) => (
                  <CSSTransition
                    key={player._id}
                    timeout={500}
                    classNames='item'
                  >
                    <div
                      className={
                        'card blue-grey darken-1 col s12 m5 left ' +
                        (index % 2 !== 0 ? 'offset-m2' : '')
                      }
                    >
                      <PlayerItem player={player} />
                    </div>
                  </CSSTransition>
                ))}
          </TransitionGroup>
        </div>
      ) : (
        <Spinner />
      )}
    </Fragment>
  );
};

export default Players;
