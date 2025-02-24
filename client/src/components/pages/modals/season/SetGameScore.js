import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Modal, Button, TextInput } from 'react-materialize';
import M from 'materialize-css/dist/js/materialize.min.js';
import SeasonContext from '../../../../context/season/seasonContext';
import AlertContext from '../../../../context/alert/alertContext';
import Spinner from '../../../layout/Spinner';

const SetGameScore = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const seasonContext = useContext(SeasonContext);
  const { setGameScore, currentGame, modalLoading } = seasonContext;

  // Form State
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');

  useEffect(() => {
    if (currentGame) {
      setScore1(currentGame.score1);
      setScore2(currentGame.score2);
      setTeam1(currentGame.team1._id);
      setTeam2(currentGame.team2._id);
    } else {
      setScore1('');
      setScore2('');
      setTeam1('');
      setTeam2('');
    }
  }, [currentGame]);

  // On submitting adding a team
  const onSetGameScore = (e) => {
    e.preventDefault();
    // Form validation
    if (score1 === '' || score2 === '') {
      setAlert('Please fill all scores !', 'danger');
      return;
    }

    // Submit
    setGameScore(
      currentGame._id,
      {
        score1,
        score2,
        team1,
        team2,
      },
      function (status, message = null) {
        // error
        if (status !== 200) {
          setAlert(message, 'danger');
          return false;
        }

        // Success
        setAlert(`Game score was set successfully`, 'success');

        // Clear and close
        clear();
      }
    );
  };

  // Clear modal and current
  const clear = (e) => {
    // Close modal
    var elem = document.getElementById('set-game-score-modal');
    var instance = M.Modal.getInstance(elem);
    instance.close();

    setScore1('');
    setScore2('');
    setTeam1('');
    setTeam2('');
  };

  return (
    <div>
      <Modal
        header={
          'Game Score (' +
          (currentGame
            ? currentGame.team1.name + ' vs ' + currentGame.team2.name
            : '') +
          ')'
        }
        className='black-text'
        bottomSheet={false}
        fixedFooter={false}
        id='set-game-score-modal'
        open={false}
      >
        {currentGame && !modalLoading ? (
          <div className='row'>
            <form className='col s12' onSubmit={(e) => onSetGameScore(e)}>
              <Fragment>
                <br />
                <TextInput
                  id='score1'
                  label={currentGame.team1.name}
                  inputClassName='black-text'
                  validate
                  required
                  autoComplete='off'
                  placeholder={currentGame.team1.name + ' score'}
                  name='score1'
                  type='number'
                  value={score1 ? String(score1) : ''}
                  onChange={(e) => setScore1(e.target.value)}
                />
                <br />
                <TextInput
                  id='score2'
                  label={currentGame.team2.name}
                  inputClassName='black-text'
                  validate
                  required
                  autoComplete='off'
                  placeholder={currentGame.team2.name + ' score'}
                  name='score2'
                  type='number'
                  value={score2 ? String(score2) : ''}
                  onChange={(e) => setScore2(e.target.value)}
                />
                <br />
                <Button
                  node='button'
                  type='submit'
                  className='btn red accent-2 right'
                >
                  Confirm
                </Button>
                <Button
                  modal='close'
                  node='a'
                  className='btn teal-grey right button-cancel'
                >
                  Cancel
                </Button>
              </Fragment>
            </form>
          </div>
        ) : (
          <Spinner />
        )}
      </Modal>
    </div>
  );
};

export default SetGameScore;
