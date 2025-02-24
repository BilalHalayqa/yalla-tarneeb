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

export default (state, action) => {
  switch (action.type) {
    // Set loading
    case SET_LOADING:
      return {
        ...state,
        error: null,
        loading: true,
      };
    // Set modal loading
    case SET_MODAL_LOADING:
      return {
        ...state,
        error: null,
        modalLoading: true,
      };
    case GET_PLAYERS:
      return {
        ...state,
        players: action.payload,
        loading: false,
        modalLoading: false,
      };
    case ADD_PLAYER:
      return {
        ...state,
        players: [action.payload, ...state.players],
        loading: false,
        modalLoading: false,
      };
    case UPDATE_PLAYER:
      return {
        ...state,
        players: state.players.map((player) =>
          player._id === action.payload._id ? action.payload : player
        ),
        loading: false,
        modalLoading: false,
      };
    case DELETE_PLAYER:
      return {
        ...state,
        players: state.players.filter(
          (player) => player._id !== action.payload
        ),
        loading: false,
        modalLoading: false,
      };
    case SET_CURRENT_PLAYER:
      return {
        ...state,
        current: action.payload,
      };
    case CLEAR_CURRENT_PLAYER:
      return {
        ...state,
        current: null,
      };
    case FILTER_PLAYERS:
      return {
        ...state,
        filtered: state.players.filter((player) => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return player.name.match(regex) || player.email.match(regex);
        }),
      };
    case CLEAR_FILTER:
      return {
        ...state,
        filtered: null,
      };
    case PLAYER_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
        modalLoading: false,
      };
    default:
      return state;
  }
};
