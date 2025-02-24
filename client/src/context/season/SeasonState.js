import React, { useReducer } from 'react';
import axios from 'axios';
import SeasonContext from './seasonContext';
import seasonReducer from './seasonReducer';
import {
  GET_SEASONS,
  ADD_SEASON,
  DELETE_SEASON,
  UPDATE_SEASON,
  SET_CURRENT_SEASON,
  CLEAR_CURRENT_SEASON,
  SEASON_ERROR,
  SET_LOADING,
  SET_MODAL_LOADING,
  ADD_TEAM,
  DELETE_TEAM,
  SET_CURRENT_TEAM,
  CLEAR_CURRENT_TEAM,
  SET_CURRENT_GAME,
  CLEAR_CURRENT_GAME,
  UPDATE_GAME_SCORE,
} from '../types';

const SeasonState = (props) => {
  const initialState = {
    seasons: null,
    currentSeason: null,
    currentTeam: null,
    currentGame: null,
    error: null,
    loading: false,
    modalLoading: false,
  };

  const [state, dispatch] = useReducer(seasonReducer, initialState);

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });
  // Set Modal Loading
  const setModalLoading = () => dispatch({ type: SET_MODAL_LOADING });

  /* SEASON MANAGEMENT */

  // Get Seasons
  const getSeasons = async () => {
    try {
      setLoading();
      const res = await axios.get('/api/seasons');
      dispatch({
        type: GET_SEASONS,
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
      dispatch({
        type: SEASON_ERROR,
        payload: err.response ? err.response.data.msg : err.msg,
      });
    }
  };
  // Add Season
  const addSeason = async (callback) => {
    try {
      setModalLoading();
      const res = await axios.post('/api/seasons');
      dispatch({
        type: ADD_SEASON,
        payload: res.data,
      });
      callback(res.status);
    } catch (err) {
      console.log(err);
      dispatch({
        type: SEASON_ERROR,
        payload: err.response.data.msg,
      });
      callback(err.response.status, err.response.data.msg);
    }
  };
  // Update Season Status
  const updateSeason = async (id, season, callback) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      setModalLoading();
      const res = await axios.put(`/api/seasons/${id}`, season, config);
      dispatch({
        type: UPDATE_SEASON,
        payload: res.data,
      });
      callback(res.status);
    } catch (err) {
      console.log(err);
      dispatch({
        type: SEASON_ERROR,
        payload: err.response.data ? err.response.data.msg : err.msg,
      });
      callback(err.response.status, err.response.data.msg);
    }
  };
  // Delete Season
  const deleteSeason = async (id, callback) => {
    try {
      setModalLoading();
      const res = await axios.delete(`/api/seasons/${id}`);
      dispatch({
        type: DELETE_SEASON,
        payload: id,
      });
      callback(res.status);
    } catch (err) {
      console.log(err);
      dispatch({
        type: SEASON_ERROR,
        payload: err.response.data ? err.response.data.msg : err.msg,
      });
      callback(err.response.status, err.response.data.msg);
    }
  };
  // Clear Current Season
  const clearCurrentSeason = () => {
    dispatch({ type: CLEAR_CURRENT_SEASON });
  };
  // Set Current Season
  const setCurrentSeason = (season) => {
    dispatch({
      type: SET_CURRENT_SEASON,
      payload: season,
    });
  };

  /* TEAM MANAGEMENT */

  // Add Team
  const addTeam = async (player, callback) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      setModalLoading();
      const res = await axios.post('/api/teams', player, config);
      dispatch({
        type: ADD_TEAM,
        payload: res.data,
      });
      callback(res.status);
    } catch (err) {
      console.log(err);
      dispatch({
        type: SEASON_ERROR,
        payload: err.response.data ? err.response.data.msg : err.msg,
      });
      callback(err.response.status, err.response.data.msg);
    }
  };
  // Delete Team
  const deleteTeam = async (id, callback) => {
    try {
      setModalLoading();
      const res = await axios.delete(`/api/teams/${id}`);
      dispatch({
        type: DELETE_TEAM,
        payload: id,
      });
      callback(res.status);
    } catch (err) {
      console.log(err);
      dispatch({
        type: SEASON_ERROR,
        payload: err.response.data ? err.response.data.msg : err.msg,
      });
      callback(err.response.status, err.response.data.msg);
    }
  };
  // Clear Current Team
  const clearCurrentTeam = () => {
    dispatch({ type: CLEAR_CURRENT_TEAM });
  };
  // Set Current Team
  const setCurrentTeam = (team) => {
    dispatch({
      type: SET_CURRENT_TEAM,
      payload: team,
    });
  };

  /* GAME MANAGEMENT */

  // Set Game Score
  const setGameScore = async (id, game, callback) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      setModalLoading();
      const res = await axios.put(`/api/games/${id}`, game, config);
      dispatch({
        type: UPDATE_GAME_SCORE,
        payload: res.data,
      });
      callback(res.status);
    } catch (err) {
      console.log(err);
      dispatch({
        type: SEASON_ERROR,
        payload: err.response.data ? err.response.data.msg : err.msg,
      });
      callback(err.response.status, err.response.data.msg);
    }
  };

  // Clear Current Game
  const clearCurrentGame = () => {
    dispatch({ type: CLEAR_CURRENT_GAME });
  };
  // Set Current Game
  const setCurrentGame = (game) => {
    dispatch({
      type: SET_CURRENT_GAME,
      payload: game,
    });
  };

  return (
    <SeasonContext.Provider
      value={{
        seasons: state.seasons,
        currentSeason: state.currentSeason,
        currentTeam: state.currentTeam,
        currentGame: state.currentGame,
        error: state.error,
        loading: state.loading,
        modalLoading: state.modalLoading,
        getSeasons,
        addSeason,
        deleteSeason,
        updateSeason,
        setCurrentSeason,
        clearCurrentSeason,
        deleteTeam,
        addTeam,
        setCurrentTeam,
        clearCurrentTeam,
        setCurrentGame,
        clearCurrentGame,
        setGameScore,
      }}
    >
      {props.children}
    </SeasonContext.Provider>
  );
};

export default SeasonState;
