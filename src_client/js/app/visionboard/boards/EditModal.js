/* eslint react/jsx-no-bind: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { execFetch } from '../../../util/FetchUtil';
import MetadataModalForm from './MetadataModalForm';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Popup modal component for editing an existing vision board.
 * Populates the vision board form with existing data from a vision board.
 */
const EditModal = ({ onClose, open, data }) => {
  const { _id, title, favorite, eventDate } = data;

  /**
   * Function to handle when the submit button is pressed in the modal form.
   *
   * @param formData
   */
  const handleSubmit = formData => {
    execFetch(`/api/visionboard/boards/${_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: formData.title,
        favorite: formData.favorite,
        eventDate: formData.eventDate
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      // Close modal if request completes successfully
      onClose(true);
    });
  };

  /**
   * Function to handle when the delete button is pressed in the modal form.
   */
  const handleDelete = () => {
    execFetch(`/api/visionboard/boards/${_id}`, {
      method: 'DELETE'
    }).then(() => {
      // Close modal if request completes successfully
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
    return (
      formData.title.length < 1 ||
      (title === formData.title &&
        favorite === formData.favorite &&
        new Date(Date.parse(eventDate)).getTime() === formData.eventDate.getTime())
    );
  };

  return (
    <MetadataModalForm
      title="Edit A Vision Board"
      open={open}
      formDefaults={{ ...data, eventDate: eventDate ? new Date(Date.parse(eventDate)) : undefined }}
      cancel={{
        enabled: true,
        label: 'Cancel',
        onClick: onClose.bind(null, false)
      }}
      submit={{
        enabled: true,
        label: 'Save',
        shouldDisable: shouldSubmitDisable,
        onClick: handleSubmit
      }}
      delete={{
        enabled: true,
        label: 'Delete',
        onClick: handleDelete
      }}
    />
  );
};

export default EditModal;

EditModal.propTypes = {
  /**
   * Callback function for when the modal is to be closed.
   * @param {boolean} success - Whether or not the modal closed with submission success.
   */
  onClose: PropTypes.func.isRequired,

  /** Whether or not the modal is currently open */
  open: PropTypes.bool.isRequired,

  /**
   * Vision board data values to initially populate the form with.
   * @see ~/src_server/models/visionboard.js
   */
  data: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    favorite: PropTypes.bool,
    eventDate: PropTypes.string
  }).isRequired
};
