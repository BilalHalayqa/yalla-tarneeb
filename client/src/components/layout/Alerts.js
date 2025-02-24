import { useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';

import M from 'materialize-css/dist/js/materialize.min.js';
const Alerts = () => {
  const alertContext = useContext(AlertContext);

  alertContext.alerts.map((alert) =>
    M.toast({
      html: alert.msg,
      classes: alert.type === 'danger' ? 'red darken-2' : 'teal accent-4',
      displayLength: alert.timeout,
    })
  );

  return '';
};

export default Alerts;
