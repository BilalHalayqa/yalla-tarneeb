import React, { Fragment, useContext, useState, useEffect } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import { Modal, Button, Select } from 'react-materialize';
import Spinner from '../../../layout/Spinner';
import SeasonContext from '../../../../context/season/seasonContext';
import AlertContext from '../../../../context/alert/alertContext';

// Update season status (Created, Running and Completed)
const UpdateSeasonStatus = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const seasonContext = useContext(SeasonContext);
  const { updateSeason, currentSeason, modalLoading } = seasonContext;

  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  useEffect(() => {
    if (currentSeason) {
      switch (currentSeason.status) {
        // Start season
        case -1:
          setModalTitle(`Begin Season ${currentSeason.number}`);
          setModalBody(
            'This will generate the teams for the current season and mark it as running. You cannot add/remove teams or remove the season after this!'
          );
          setModalSuccess(
            `Season ${currentSeason.number} is running now !`,
            'success'
          );
          break;
        case 0:
          // Playoffs
          if (currentSeason.remaining_games === -1) {
            setModalTitle('Playoffs Round');
            setModalBody('Generates playoffs round games.');
            setModalSuccess('Generated successfully');
          }
          // Finish Season
          else if (currentSeason.remaining_games === 0) {
            setModalTitle('Finish Season');
            setModalBody('Decied the winner and mark the season as completed.');
            setModalSuccess('Completed successfully');
          }
          // Next round
          else {
            setModalTitle('Next Playoffs Round');
            setModalBody('Generates next playoffs round games.');
            setModalSuccess('Generated successfully');
          }
          break;
        default:
          setModalTitle('');
          setModalBody('');
          setModalSuccess('');
      }
    } else {
      setModalTitle('');
      setModalBody('');
      setModalSuccess('');
    }
  }, [currentSeason]);

  // Form State
  const [season, setSeason] = useState({
    games_with_teams: '1',
    playoffs: '1',
    playoffs_type: '1',
    last_playoffs_times: '1',
  });

  const onChange = (e) =>
    setSeason({ ...season, [e.target.name]: e.target.value });

  // On submitting adding a team
  const onUpdateStatus = (e) => {
    e.preventDefault();

    if (!currentSeason) return;

    switch (currentSeason.status) {
      // Start season
      case -1:
        updateSeason(
          currentSeason._id,
          {
            status: currentSeason.status + 1,
            games_with_teams: season.games_with_teams,
          },
          function (status, message = null) {
            // error
            if (status !== 200) {
              setAlert(message, 'danger');
              return false;
            }
            // Success
            setAlert(modalSuccess);
            // Close
            CloseModal();
          }
        );
        break;
      case 0:
        let load = {};
        if (currentSeason.remaining_games === -1) {
          load = {
            status: currentSeason.status + 1,
            playoffs: season.playoffs,
            playoffs_type: season.playoffs_type,
            last_playoffs_times: season.last_playoffs_times,
          };
        } else {
          load = {
            status: currentSeason.status + 1,
            last_playoffs_times: season.last_playoffs_times,
          };
        }
        // Playoffs
        updateSeason(currentSeason._id, load, function (
          status,
          message = null
        ) {
          // error
          if (status !== 200) {
            setAlert(message, 'danger');
            return false;
          }
          // Success
          setAlert(modalSuccess);
          // Close
          CloseModal();
        });
        break;
      default:
        break;
    }
  };

  // Clear modal
  const CloseModal = (e) => {
    // Close modal
    var elem = document.getElementById('update-season-status-modal');
    var instance = M.Modal.getInstance(elem);
    instance.close();
  };

  return (
    <div>
      <Modal
        header={modalTitle}
        className='black-text'
        bottomSheet={false}
        fixedFooter={false}
        id='update-season-status-modal'
        open={false}
        options={{ onCloseStart: (e) => CloseModal(e) }}
      >
        {!modalLoading ? (
          <div className='row'>
            <form className='col s12' onSubmit={(e) => onUpdateStatus(e)}>
              <Fragment>
                <p className='black-text'>{modalBody}</p>
                <br />
                {/* Begin season, generate first round games */}
                {currentSeason && currentSeason.status === -1 && (
                  <Fragment>
                    <Select
                      id='games_with_teams'
                      name='games_with_teams'
                      label='How many times each team is playing the others, per team ?'
                      validate
                      required
                      onChange={(e) => onChange(e)}
                      value={season.games_with_teams}
                    >
                      <option value='1'>1 time</option>
                      <option value='2'>2 times</option>
                      <option value='3'>3 times</option>
                      <option value='4'>4 times</option>
                      <option value='5'>5 times</option>
                    </Select>
                    <br />
                  </Fragment>
                )}
                {/* Generate first  */}
                {currentSeason &&
                  currentSeason.status === 0 &&
                  currentSeason.remaining_games === -1 && (
                    <Fragment>
                      <Select
                        label='How many teams to pick for the playoffs ?'
                        name='playoffs'
                        validate
                        required
                        onChange={(e) => onChange(e)}
                        value={season.playoffs}
                      >
                        <option value='1'>Top scores team</option>
                        <option value='2'>Between top 2 teams</option>
                        <option value='4'>Between top 4 teams</option>
                        <option value='8'>Between top 8 teams</option>
                        <option value='16'>Between top 16 teams</option>
                      </Select>
                      <br />
                      <Select
                        name='playoffs_type'
                        label='Playoffs round criteria'
                        validate
                        required
                        onChange={(e) => onChange(e)}
                        value={season.playoffs_type}
                      >
                        <option value='1'>First plays last</option>
                        <option value='2'>Random</option>
                      </Select>
                      <br />
                      <Select
                        name='last_playoffs_times'
                        label='How many games each ?'
                        validate
                        required
                        onChange={(e) => onChange(e)}
                        value={season.last_playoffs_times}
                      >
                        <option value='1'>1 time</option>
                        <option value='3'>3 times</option>
                        <option value='5'>5 times</option>
                      </Select>
                      <br />
                    </Fragment>
                  )}
                {currentSeason &&
                  currentSeason.status === 0 &&
                  currentSeason.remaining_games !== 0 &&
                  currentSeason.remaining_games !== -1 && (
                    <Select
                      name='last_playoffs_times'
                      label='How many games each ?'
                      validate
                      required
                      onChange={(e) => onChange(e)}
                      value={season.last_playoffs_times}
                    >
                      <option value='1'>1 time</option>
                      <option value='3'>3 times</option>
                      <option value='5'>5 times</option>
                    </Select>
                  )}
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

export default UpdateSeasonStatus;
