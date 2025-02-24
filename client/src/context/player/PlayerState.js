import React, { useReducer } from 'react';
import axios from 'axios';
import PlayerContext from './playerContext';
import playerReducer from './playerReducer';
import {
  GET_PLAYERS,
  ADD_PLAYER,
  DELETE_PLAYER,
  SET_CURRENT_PLAYER,
  CLEAR_CURRENT_PLAYER,
  UPDATE_PLAYER,
  FILTER_PLAYERS,
  CLEAR_FILTER,
  PLAYER_ERROR,
  SET_LOADING,
  SET_MODAL_LOADING,
} from '../types';

const PlayerState = (props) => {
  const initialState = {
    players: null,
    current: null,
    filtered: null,
    error: null,
    loading: false,
    modalLoading: false,
  };

  const [state, dispatch] = useReducer(playerReducer, initialState);

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  // Set Modal Loading
  const setModalLoading = () => dispatch({ type: SET_MODAL_LOADING });

  // Get Players
  const getPlayers = async () => {
    try {
      setLoading();
      const res = await axios.get('/api/players');
      dispatch({
        type: GET_PLAYERS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: PLAYER_ERROR,
        payload: err.response.data.msg,
      });
    }
  };

  // Add Player
  const addPlayer = async (player, callback) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      setModalLoading();
      const res = await axios.post('/api/players', player, config);
      dispatch({
        type: ADD_PLAYER,
        payload: res.data,
      });
      callback(res.status);
    } catch (err) {
      console.log(err);
      dispatch({
        type: PLAYER_ERROR,
        payload: err.response.data.msg,
      });
      callback(err.response.status, err.response.data.msg);
    }
  };

  // Delete Player
  const deletePlayer = async (id, callback) => {
    try {
      setModalLoading();
      const res = await axios.delete(`/api/players/${id}`);
      dispatch({
        type: DELETE_PLAYER,
        payload: id,
      });
      callback(res.status);
    } catch (err) {
      console.log(err);
      dispatch({
        type: PLAYER_ERROR,
        payload: err.response.data.msg,
      });
      callback(err.response.status, err.response.data.msg);
    }
  };

  // Update Player
  const updatePlayer = async (player, callback) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      setModalLoading();
      const res = await axios.put(`/api/players/${player._id}`, player, config);
      dispatch({
        type: UPDATE_PLAYER,
        payload: res.data,
      });
      callback(res.status);
    } catch (err) {
      console.log(err);
      dispatch({
        type: PLAYER_ERROR,
        payload: err.response.data.msg,
      });
      callback(err.response.status, err.response.data.msg);
    }
  };

  // Set Current Player
  const setCurrent = (player) => {
    dispatch({
      type: SET_CURRENT_PLAYER,
      payload: player,
    });
  };

  // Clear Current Player
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT_PLAYER });
  };

  // Filter Players
  const filterPlayers = (text) => {
    dispatch({
      type: FILTER_PLAYERS,
      payload: text,
    });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <PlayerContext.Provider
      value={{
        players: state.players,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        loading: state.loading,
        modalLoading: state.modalLoading,
        addPlayer,
        deletePlayer,
        setCurrent,
        clearCurrent,
        updatePlayer,
        filterPlayers,
        clearFilter,
        getPlayers,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerState;
