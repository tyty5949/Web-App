import React from 'react';
import PropTypes from 'prop-types';
import { execFetch } from '../../../util/FetchUtil';
import MetadataModalForm from './MetadataModalForm';

/**
 * Popup modal component for creating a new vision board.
 */
const CreateModal = ({ onClose, open }) => {
  /**
   * Function to handle when the 'Submit' button for the vision board creation form is pressed.
   *
   * @param formData - Form data from the vision board creation form.
   */
  const handleSubmit = formData => {
    execFetch('/api/visionboard/boards', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      // Close modal if submission completes successfully
      onClose(true);
    });
  };

  /**
   * Function to determine whether or not the vision board creation form should be able to be
   * submitted with the current form data.
   *
   * @param formData - Form data from the vision board creation form.
   * @returns {boolean} - Whether or not the submit button should be disabled.
   */
  const shouldSubmitDisable = formData => {
    return !(formData.title.length > 0);
  };

  return (
    <MetadataModalForm
      title="Create A New Vision Board"
      open={open}
      cancel={{
        enabled: true,
        label: 'Cancel',
        onClick: onClose.bind(null, false)
      }}
      submit={{
        enabled: true,
        label: 'Create',
        shouldDisable: shouldSubmitDisable,
        onClick: handleSubmit
      }}
    />
  );
};

export default CreateModal;

CreateModal.propTypes = {
  /**
   * Callback function for when the modal closes.
   *
   * @type function
   * @param {boolean} success - Whether or not a vision board was created successfully.
   */
  onClose: PropTypes.func.isRequired,

  /**
   * Whether or not the modal should be displayed.
   *
   * @type boolean
   */
  open: PropTypes.bool.isRequired
};
