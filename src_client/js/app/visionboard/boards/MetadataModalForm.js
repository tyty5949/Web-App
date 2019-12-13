/* eslint jsx-a11y/label-has-associated-control: 0 */
/* eslint jsx-a11y/label-has-for: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Form, Modal } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Component which wraps the vision board creation/edit/delete form and modal.
 *
 * This is a "parent component" because it is designed to be implemented and configured
 * for multiple applications. Two examples are for the EditModal and CreateModal components.
 */
export default class MetadataModalForm extends React.Component {
  constructor(props) {
    super(props);
    const { formDefaults } = props;

    this.state = {
      /* Whether or not the delete confirmation modal is open */
      deleteConfirmationOpen: false,

      /* Whether or not the submit button should be set to loading */
      submitLoading: false,

      /* Whether or not the delete button should be set to loading */
      deleteLoading: false,

      /* Object which holds all the form data for the vision board. Initially props.formDefaults */
      /* @see src_server/models/visionboard.js */
      formData: {
        title: formDefaults.title,
        eventDate: formDefaults.eventDate,
        favorite: formDefaults.favorite
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFormDelete = this.onFormDelete.bind(this);
    this.onDeleteConfirmationClose = this.onDeleteConfirmationClose.bind(this);
    this.shouldSubmitDisable = this.shouldSubmitDisable.bind(this);
  }

  /**
   * Function to handle when the form has requested to submit its data. One place this occurs is
   * when the submit button is pressed.
   *
   * @param {Event} event - DOM based event object.
   */
  onFormSubmit(event) {
    const { submit } = this.props;
    const { formData } = this.state;

    this.setState({ submitLoading: true });

    // Execute onSubmit callback
    submit.onClick(formData);

    // Prevent default submit functionality of form
    event.preventDefault();
  }

  /**
   * Function to handle when the form has requested to delete a vision board. One place this
   * occurs is when the delete button is pressed and confirmed.
   */
  onFormDelete() {
    const { delete: _delete } = this.props;
    const { formData } = this.state;

    this.setState({ deleteLoading: true });

    // Execute onClick callback for the delete button
    _delete.onClick(formData);
  }

  /**
   * Function to handle when the delete confirmation modal is closed.
   *
   * @param {boolean} success - Whether or not the delete operation was confirmed.
   */
  onDeleteConfirmationClose(success) {
    this.setState({ deleteConfirmationOpen: false });

    if (success) {
      this.onFormDelete();
    }
  }

  /**
   * Function that handles changes to the form inputs.
   *
   * @param {string} name - Name of the index in formData
   * @param {any} value - Value to change index in formData to
   */
  handleChange({ name, value }) {
    const { formData } = this.state;
    this.setState({ formData: { ...formData, [name]: value } });
  }

  /**
   * Function to determine whether or not the submit button should be enabled.
   * The button is only enabled if it is not waiting for a submit action to finish and the form
   * data is validated for submission via the `props.actionOptions.submit.shouldDisable` callback.
   *
   * @return {boolean} - Whether or not the submit button should be disabled.
   */
  shouldSubmitDisable() {
    const { submit } = this.props;
    const { submitLoading, formData } = this.state;

    return submitLoading || (submit.shouldDisable ? submit.shouldDisable(formData) : false);
  }

  render() {
    const { title, open, submit, cancel, delete: _delete } = this.props;
    const { deleteConfirmationOpen, submitLoading, deleteLoading, formData } = this.state;

    return (
      <div>
        <Modal dimmer="blurring" closeOnEscape={false} closeOnDimmerClick={false} open={open}>
          <Modal.Header icon="archive">{title}</Modal.Header>
          <Modal.Content>
            <Form>
              {/* Title */}
              <Form.Field>
                <label>Board Name</label>
                <input
                  value={formData.title}
                  placeholder="Board name..."
                  name="title"
                  onChange={event =>
                    this.handleChange({ name: event.target.name, value: event.target.value })
                  }
                />
              </Form.Field>

              {/* Event Date */}
              <Form.Field>
                <label>Event Date</label>
                <DatePicker
                  selected={formData.eventDate}
                  onChange={date => this.handleChange({ name: 'eventDate', value: date })}
                  minDate={new Date()}
                />
              </Form.Field>

              {/* Favorite checkbox */}
              <Form.Field>
                <Checkbox
                  label="Favorite Board"
                  name="favorite"
                  checked={formData.favorite}
                  onChange={(e, data) =>
                    this.handleChange({ name: 'favorite', value: data.checked })
                  }
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          {/* Modal actions */}
          <Modal.Actions>
            <div className={_delete.enabled ? 'vision-board-edit-modal-actions' : ''}>
              {/* Delete button */}
              {_delete.enabled && (
                <Button
                  content="Delete"
                  icon="trash"
                  labelPosition="left"
                  negative
                  loading={deleteLoading}
                  disabled={deleteLoading}
                  onClick={() => this.setState({ deleteConfirmationOpen: true })}
                />
              )}
              <div className="button-group">
                {/* Cancel button */}
                {cancel.enabled && (
                  <Button content="Cancel" onClick={() => cancel.onClick(false)} />
                )}

                {/* Submit button */}
                {submit.enabled && (
                  <Button
                    primary
                    content={submit.label}
                    loading={submitLoading}
                    disabled={this.shouldSubmitDisable()}
                    onClick={this.onFormSubmit}
                  />
                )}
              </div>
            </div>
          </Modal.Actions>
        </Modal>

        {/* Delete confirmation modal */}
        <Modal dimmer open={deleteConfirmationOpen} size="small">
          <Modal.Header>{`Confirm ${_delete.label}`}</Modal.Header>
          <Modal.Content>
            <p>{`Are you sure you want to permanently ${_delete.label.toLowerCase()} this Vision Board?`}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button content="Cancel" onClick={() => this.onDeleteConfirmationClose(false)} />
            <Button
              icon="trash"
              content={_delete.label}
              labelPosition="left"
              negative
              onClick={() => this.onDeleteConfirmationClose(true)}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

MetadataModalForm.propTypes = {
  /** Title of the popup modal */
  title: PropTypes.string,

  /** Whether or not the popup modal should be open */
  open: PropTypes.bool.isRequired,

  /**
   * Default vision board data values for the form
   * @see ~/src_server/models/visionboard.js
   */
  formDefaults: PropTypes.shape({
    title: PropTypes.string,
    eventDate: PropTypes.instanceOf(Date),
    favorite: PropTypes.bool
  }),

  /** Configuration for the cancel button */
  cancel: PropTypes.shape({
    /** Whether or not the button is enabled in the modal */
    enabled: PropTypes.bool.isRequired,
    /** The label for the button to display */
    label: PropTypes.string.isRequired,
    /** onClick callback for button */
    onClick: PropTypes.func
  }),

  /** Configuration for the submit button */
  submit: PropTypes.shape({
    /** Whether or not the button is enabled in the modal */
    enabled: PropTypes.bool.isRequired,
    /** The label for the button to display */
    label: PropTypes.string.isRequired,
    /** Function to determine whether or not the submit button should be disabled.
     * @param formData
     * @return {boolean}
     */
    shouldDisable: PropTypes.func,
    /**
     *  onClick callback for button
     *  @param formData - The vision board form data
     */
    onClick: PropTypes.func
  }),

  /**
   * Configuration for the delete button
   * NOTE: This button is disabled by default
   */
  delete: PropTypes.shape({
    /** Whether or not the button is enabled in the modal */
    enabled: PropTypes.bool.isRequired,
    /** The label for the button to display */
    label: PropTypes.string.isRequired,
    /**
     *  onClick callback for button
     *  @param formData - The vision board form data
     */
    onClick: PropTypes.func
  })
};

MetadataModalForm.defaultProps = {
  title: 'Vision Boards Form',
  formDefaults: {
    title: '',
    eventDate: new Date(),
    favorite: false
  },
  cancel: {
    enabled: true,
    label: 'Cancel',
    onClick: undefined
  },
  submit: {
    enabled: true,
    label: 'Cancel',
    shouldDisable: () => {
      return false;
    },
    onClick: undefined
  },
  delete: {
    enabled: false,
    label: 'Cancel',
    onClick: undefined
  }
};
