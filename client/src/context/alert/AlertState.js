import React, { useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { SET_ALERT, CLEAR_ALERTS } from '../types';
import M from 'materialize-css/dist/js/materialize.min.js';

const AlertState = (props) => {
  const initialState = [];

  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set Alert
  const setAlert = (msg, type, timeout = 3000) => {
    // Clear alerts
    clearAlerts();

    // Save the alert
    const id = uuidv4();
    dispatch({
      type: SET_ALERT,
      payload: {
        msg,
        type,
        id,
        timeout,
      },
    });

    // Remove from the list after the timeout
    setTimeout(
      () =>
        dispatch({
          type: CLEAR_ALERTS,
        }),
      timeout
    );
  };

  // Clear Alerts
  const clearAlerts = () => {
    // Clear alerts
    M.Toast.dismissAll();
    dispatch({ type: CLEAR_ALERTS });
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert,
        clearAlerts,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
