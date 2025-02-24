import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Modal, Button, Select, TextInput } from 'react-materialize';
import M from 'materialize-css/dist/js/materialize.min.js';
import SeasonContext from '../../../../context/season/seasonContext';
import PlayerContext from '../../../../context/player/playerContext';
import AlertContext from '../../../../context/alert/alertContext';
import Spinner from '../../../layout/Spinner';

const AddTeam = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const seasonContext = useContext(SeasonContext);
  const { addTeam, currentSeason, modalLoading } = seasonContext;

  const playerContext = useContext(PlayerContext);
  const { getPlayers, players } = playerContext;

  // Form State
  const [team, setTeam] = useState({
    season: currentSeason ? currentSeason._id : '',
    name: '',
    player1: '-1',
    player2: '-1',
  });

  useEffect(() => {
    // Get players
    getPlayers();
    // eslint-disable-next-line
  }, []);

  const onChange = (e) =>
    setTeam({
      ...team,
      [e.target.name]: e.target.value,
    });

  // On submitting adding a team
  const onAddTeam = (e) => {
    e.preventDefault();
    // Form validation
    if (
      !team.name ||
      !team.player1 ||
      !team.player2 ||
      team.player1 === '-1' ||
      team.player2 === '-1'
    ) {
      setAlert('All fields are required!', 'danger');
      return;
    } else if (team.player1 === team.player2) {
      setAlert('Cannot make a team with one player !', 'danger');
      return;
    }

    // Submit
    addTeam({ ...team, season: currentSeason._id }, function (
      status,
      message = null
    ) {
      // error
      if (status !== 200) {
        setAlert(message, 'danger');
        return false;
      }

      // Success
      setAlert(`'${team.name}' team was created successfully`, 'success');

      // Clear and close
      clear();
    });
  };

  // Clear modal and current
  const clear = (e) => {
    // Close modal
    var elem = document.getElementById('add-team-modal');
    var instance = M.Modal.getInstance(elem);
    instance.close();

    setTeam({ ...team, name: '', player1: '-1', player2: '-1' });
  };

  const renderPlayerSelectList = (array) => {
    return array
      ? array.map((player, index) => (
          <option key={index} value={player._id}>
            {player.name}
          </option>
        ))
      : [];
  };

  return (
    <div>
      <Modal
        header={
          'Add Team (Season ' +
          (currentSeason ? currentSeason.number : '') +
          ')'
        }
        className='black-text'
        bottomSheet={false}
        fixedFooter={false}
        id='add-team-modal'
        open={false}
        options={{ onCloseStart: (e) => clear(e) }}
      >
        {players !== null && !modalLoading ? (
          <div className='row'>
            <form className='col s12' onSubmit={(e) => onAddTeam(e)}>
              <Fragment>
                <p className='red-text'>* Once added, cannot be updated.</p>
                <br />
                <TextInput
                  id='team-name'
                  label='Team Name'
                  inputClassName='black-text'
                  validate
                  required
                  autoComplete='off'
                  placeholder='Team Name'
                  name='name'
                  onChange={(e) => onChange(e)}
                />
                <br />
                <Select
                  id='player-1-select'
                  name='player1'
                  validate
                  required
                  onChange={(e) => onChange(e)}
                  value={team.player1}
                >
                  <option disabled value='-1'>
                    Select Player 1
                  </option>
                  {renderPlayerSelectList(players)}
                </Select>
                <br />
                <Select
                  id='player-2-select'
                  name='player2'
                  validate
                  required
                  onChange={(e) => onChange(e)}
                  value={team.player2}
                >
                  <option disabled value='-1'>
                    Select Player 2
                  </option>
                  {renderPlayerSelectList(players)}
                </Select>
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

export default AddTeam;
