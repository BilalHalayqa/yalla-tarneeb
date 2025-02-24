import React, { useContext, useRef, useEffect } from 'react';
import PlayerContext from '../../../context/player/playerContext';

const PlayerFilter = () => {
  const playerContext = useContext(PlayerContext);
  const text = useRef('');

  const { filterPlayers, clearFilter, filtered } = playerContext;

  useEffect(() => {
    if (filtered === null) {
      text.current.value = '';
    }
  });

  const onChange = (e) => {
    if (text.current.value !== '') {
      filterPlayers(e.target.value);
    } else {
      clearFilter();
    }
  };

  return (
    <form>
      <br />
      <input
        style={{ border: '1px solid #9e9e9e' }}
        className='input-field validate white-text center'
        ref={text}
        type='text'
        placeholder='Search Players...'
        onChange={(e) => onChange(e)}
      />
    </form>
  );
};

export default PlayerFilter;
