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
export default (state, action) => {
  let seasons = [];
  let tempCurrentSeason = null;
  let currentSeasonId = null;
  let currentGameId = null;
  let currentSeasons = null;
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
    // Get seasons
    case GET_SEASONS:
      seasons = action.payload;
      tempCurrentSeason = state.currentSeason
        ? state.currentSeason
        : calculateCurrent(seasons);
      return {
        ...state,
        error: null,
        seasons: seasons,
        currentSeason: tempCurrentSeason,
        currentTeam: null,
        loading: false,
        modalLoading: false,
      };
    // Add season
    case ADD_SEASON:
      seasons = [...state.seasons, action.payload];
      tempCurrentSeason = calculateCurrent(seasons);
      return {
        ...state,
        error: null,
        seasons: [...state.seasons, action.payload],
        currentSeason: tempCurrentSeason,
        currentTeam: null,
        loading: false,
        modalLoading: false,
      };
    // Add team
    case ADD_TEAM:
      // Add the team to the list of teams in the current season
      tempCurrentSeason = state.currentSeason;
      currentSeasonId = tempCurrentSeason._id;
      currentSeasons = state.seasons;
      if (currentSeasons && currentSeasons.length > 0) {
        currentSeasons.map((season, index) => {
          // Active season
          if (season._id === currentSeasonId) {
            // If team is not there, add it
            if (
              season.teams.filter((team) => team._id === action.payload._id)
                .length === 0
            ) {
              // Add the team
              season.teams = [...season.teams, action.payload];
              // Updatee current season
              tempCurrentSeason = season;
            }
            return false;
          }
          return true;
        });
      }
      return {
        ...state,
        error: null,
        seasons: currentSeasons,
        currentSeason: tempCurrentSeason,
        currentTeam: null,
        loading: false,
        modalLoading: false,
      };
    // Delete season
    case DELETE_SEASON:
      seasons = state.seasons.filter((season) => season._id !== action.payload);
      tempCurrentSeason = calculateCurrent(seasons);
      return {
        ...state,
        error: null,
        seasons: seasons,
        currentSeason: tempCurrentSeason,
        currentTeam: null,
        loading: false,
        modalLoading: false,
      };
    // Delete team
    case DELETE_TEAM:
      // Remove the team from the list of teams in the current season
      tempCurrentSeason = state.currentSeason;
      currentSeasonId = tempCurrentSeason._id;
      currentSeasons = state.seasons;
      if (currentSeasons && currentSeasons.length > 0) {
        currentSeasons.map((season) => {
          // Active season
          if (season._id === currentSeasonId) {
            season.teams = season.teams.filter(
              (team) => team._id !== action.payload
            );

            // Updatee current season
            tempCurrentSeason = season;
            return false;
          }
          return true;
        });
      }
      return {
        ...state,
        error: null,
        seasons: currentSeasons,
        currentSeason: tempCurrentSeason,
        currentTeam: null,
        loading: false,
        modalLoading: false,
      };
    // Update season
    case UPDATE_SEASON:
      return {
        ...state,
        seasons: state.seasons.map((season) =>
          season._id === action.payload._id ? action.payload : season
        ),
        currentSeason: action.payload,
        currentTeam: null,
        loading: false,
        modalLoading: false,
      };
    // Set current season
    case SET_CURRENT_SEASON:
      return {
        ...state,
        error: null,
        currentSeason: action.payload
          ? action.payload
          : calculateCurrent(state.seasons),
        currentTeam: null,
      };
    // Clear current season
    case CLEAR_CURRENT_SEASON:
      return {
        ...state,
        error: null,
        currentSeason: null,
        currentTeam: null,
      };

    // Set current team
    case SET_CURRENT_TEAM:
      return {
        ...state,
        error: null,
        currentTeam: action.payload,
      };
    // Clear current team
    case CLEAR_CURRENT_TEAM:
      return {
        ...state,
        error: null,
        currentTeam: null,
      };
    // Update game score
    case UPDATE_GAME_SCORE:
      // Add the team to the list of teams in the current season
      tempCurrentSeason = state.currentSeason;
      currentSeasonId = tempCurrentSeason._id;
      currentGameId = state.currentGame._id;
      currentSeasons = state.seasons;
      if (currentSeasons && currentSeasons.length > 0) {
        // Loop through seasons
        currentSeasons.map((season, index) => {
          // Active season
          if (season._id === currentSeasonId) {
            // Loop through games
            season.games.map((game) => {
              // Active game
              if (game._id === currentGameId) {
                game.score1 = action.payload.score1;
                game.score2 = action.payload.score2;
                // Updatee current season
                tempCurrentSeason = season;
                return false;
              }
              return true;
            });
            return true;
          }
          return true;
        });
      }
      return {
        ...state,
        error: null,

        seasons: currentSeasons,
        currentSeason: tempCurrentSeason,

        currentGame: null,
        loading: false,
        modalLoading: false,
      };
    // Set current game
    case SET_CURRENT_GAME:
      return {
        ...state,
        error: null,
        currentGame: action.payload,
      };
    // Clear current game
    case CLEAR_CURRENT_GAME:
      return {
        ...state,
        error: null,
        currentGame: null,
      };
    // Set error
    case SEASON_ERROR:
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

// Set Current Season
const calculateCurrent = (seasons) => {
  let currentSeason = seasons[seasons.length - 1];
  seasons.map((season) => {
    if (season.status === 0) {
      currentSeason = season;
      return false;
    }
    return true;
  });
  return currentSeason;
};
