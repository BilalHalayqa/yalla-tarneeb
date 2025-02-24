import React, { useState, useContext, useEffect, Fragment } from 'react';
import { Modal, Select, Button, TextInput } from 'react-materialize';
import M from 'materialize-css/dist/js/materialize.min.js';
import PlayerContext from '../../../../context/player/playerContext';
import AlertContext from '../../../../context/alert/alertContext';
import Spinner from '../../../layout/Spinner';
import Countries from './Countries';

const AddUpdatePlayer = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const playerContext = useContext(PlayerContext);
  const {
    addPlayer,
    updatePlayer,
    current,
    clearCurrent,
    modalLoading,
  } = playerContext;

  useEffect(() => {
    if (current) {
      setPlayer(current);
    } else {
      setPlayer({
        name: '',
        nickname: '',
        email: '',
        country: '-1',
      });
    }
  }, [current]);

  // Form State
  const [player, setPlayer] = useState({
    name: '',
    nickname: '',
    email: '',
    country: '-1',
  });

  const onChange = (e) =>
    setPlayer({ ...player, [e.target.name]: e.target.value });

  // On submitting adding a team
  const onAddUpdatePlayer = (e) => {
    e.preventDefault();
    if (
      !player.name ||
      !player.email ||
      !player.country ||
      player.country === '-1'
    ) {
      // Success
      setAlert('Pleas select a country', 'danger');
      return;
    }

    if (current) {
      updatePlayer(player, function (status, message = null) {
        // error
        if (status !== 200) {
          setAlert(message, 'danger');
          return false;
        }

        // Success
        setAlert('Player was updated successfully', 'success');

        // Clear and close
        clear();
      });
    } else {
      addPlayer(player, function (status, message = null) {
        // error
        if (status !== 200) {
          setAlert(message, 'danger');
          return false;
        }

        // Success
        setAlert('Player was created successfully', 'success');

        // Clear and close
        clear();
      });
    }
  };

  // Clear modal and current
  const clear = (e) => {
    // Close modal
    var elem = document.getElementById('add-edit-player-modal');
    var instance = M.Modal.getInstance(elem);
    instance.close();

    clearCurrent();
    setPlayer({
      name: '',
      nickname: '',
      email: '',
      country: '',
    });
  };

  return (
    <div>
      <Modal
        header={current ? 'Edit Player' : 'Add Player'}
        className='black-text'
        bottomSheet={false}
        fixedFooter={false}
        id='add-edit-player-modal'
        open={false}
        options={{ onCloseStart: (e) => clear(e) }}
      >
        {!modalLoading ? (
          <div className='row'>
            <form className='col s12' onSubmit={(e) => onAddUpdatePlayer(e)}>
              <Fragment>
                <TextInput
                  label='Name'
                  inputClassName='black-text input-field validate'
                  validate
                  required
                  name='name'
                  value={player.name}
                  autoComplete='off'
                  placeholder='Name'
                  onChange={(e) => onChange(e)}
                />

                <TextInput
                  label='Nickname (Jawaker)'
                  inputClassName='black-text input-field validate'
                  validate
                  name='nickname'
                  value={player.nickname}
                  autoComplete='off'
                  placeholder='Name'
                  onChange={(e) => onChange(e)}
                />

                <TextInput
                  label='Email'
                  type='email'
                  inputClassName='black-text input-field validate'
                  validate
                  required
                  value={player.email}
                  name='email'
                  placeholder='Email'
                  autoComplete='off'
                  onChange={(e) => onChange(e)}
                />
                
                <Select
                  name='country'
                  placeholder='Country'
                  validate
                  required
                  onChange={(e) => onChange(e)}
                  value={player.country}
                >
                  <Countries />
                </Select>

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

export default AddUpdatePlayer;
