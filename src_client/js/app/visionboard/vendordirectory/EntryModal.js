import React, { useContext, useEffect, useState } from 'react';
import { Button, Dimmer, Form, Loader, Message, Modal } from 'semantic-ui-react';
import { VisionBoardContext } from 'contexts/VisionBoard';
import { useFetch } from '../../../util/FetchUtil';

const EntryModal = ({ entryId, open, type, onClose }) => {
  const [formData, setFormData] = useState({});
  const visionBoardContext = useContext(VisionBoardContext);
  const editMode = type === 'edit';

  /**
   * Load all data for the specific vendor directory entry and set the formData to the loaded
   * data.
   */
  const vendorFetch = useFetch(
    `/api/visionboard/boards/${visionBoardContext._id}/vendors/${entryId}`,
    { method: 'GET' }
  );

  // Set form data once response loads
  useEffect(() => {
    setFormData(vendorFetch.response || {});
  }, [vendorFetch.response]);

  return (
    <div>
      <Modal dimmer="blurring" closeOnEscape={false} closeOnDimmerClick={false} open={open}>
        <Modal.Header icon="archive">
          {editMode ? 'Edit a Vendor Entry' : 'Add a New Vendor Entry'}
        </Modal.Header>

        {/* Entry form */}
        <Modal.Content>
          <Form>
            {/* Loader */}
            <Dimmer inverted active={vendorFetch.isLoading}>
              <Loader />
            </Dimmer>

            {/* Error message */}
            {vendorFetch.error && (
              <Message
                icon="warning sign"
                negative
                header="Something went wrong!"
                content={vendorFetch.error}
              />
            )}

            {/* Vendor name */}
            <Form.Field>
              <label htmlFor="name">Vendor Name</label>
              <input
                value={formData.name || ''}
                placeholder="Vendor name..."
                name="name"
                onChange={event => setFormData({ ...formData, name: event.target.value })}
              />
            </Form.Field>

            <Form.Group widths="equal">
              {/* Vendor type */}
              <Form.Field>
                <label htmlFor="type">Type</label>
                <input
                  value={formData.type || ''}
                  placeholder="Vendor type..."
                  name="type"
                  onChange={event => setFormData({ ...formData, type: event.target.value })}
                />
              </Form.Field>

              {/* Vendor status */}
              <Form.Field>
                <label htmlFor="status">Status</label>
                <input
                  value={formData.status || ''}
                  placeholder="Vendor status..."
                  name="status"
                  onChange={event => setFormData({ ...formData, status: event.target.value })}
                />
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Content>

        {/* Modal actions */}
        <Modal.Actions>
          <div className={editMode ? 'vision-board-edit-modal-actions' : ''}>
            {/* Delete button */}
            {editMode && (
              <Button
                content="Delete"
                icon="trash"
                labelPosition="left"
                negative
                disabled={vendorFetch.error !== null}
                onClick={() => {
                  /* TODO */
                }}
              />
            )}
            <div className="button-group">
              {/* Cancel button */}
              {editMode && (
                <Button
                  content="Cancel"
                  onClick={() => {
                    onClose(false);
                  }}
                />
              )}

              {/* Submit button */}
              <Button
                primary
                content={editMode ? 'Save' : 'Add Entry'}
                disabled={vendorFetch.error !== null}
                onClick={() => {
                  /* TODO */
                }}
              />
            </div>
          </div>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default EntryModal;
