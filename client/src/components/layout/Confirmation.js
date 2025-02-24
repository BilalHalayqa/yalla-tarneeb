import React, { Fragment } from 'react';
import { Modal, Button } from 'react-materialize';
import PropTypes from 'prop-types';
import Spinner from '../../components/layout/Spinner';

const ConfirmationModal = ({
  id,
  title,
  message,
  modalLoading,
  confirm = null,
  closed = null,
}) => {
  return (
    <Modal
      header={title}
      actions={[]}
      className='black-text'
      bottomSheet={false}
      fixedFooter={false}
      id={id}
      open={false}
      options={{ onCloseStart: (e) => (closed ? closed(e) : {}) }}
    >
      {!modalLoading ? (
        <Fragment>
          <p className='black-text'>{message}</p>
          <div className='confirmation-buttons'>
            <Button
              modal='close'
              node='button'
              className='btn teal-grey button-cancel'
            >
              Cancel
            </Button>
            {confirm && (
              <Button
                node='button'
                onClick={(e) => confirm(e)}
                className='btn red red darken-1'
              >
                Confirm
              </Button>
            )}
          </div>
        </Fragment>
      ) : (
        <Spinner />
      )}
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirm: PropTypes.func,
};

export default ConfirmationModal;
