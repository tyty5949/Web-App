import React from 'react';
import PropTypes from 'prop-types';
import { Button, Loader, Message } from 'semantic-ui-react';
import { execFetch } from '../../../util/FetchUtil';
import CreateModal from './CreateModal';
import BoardListCard from './BoardListCard';
import EditModal from './EditModal';
import 'less/visionboard/Boards.less';

/**
 * Displays the list of Vision Boards cards.
 */
const BoardList = ({ onItemChange, items, onItemEdit }) => {
  return (
    <div className="list">
      {items.map((item, index) => {
        return (
          <BoardListCard
            key={item._id}
            delayIndex={index}
            onChange={onItemChange}
            data={item}
            onEdit={onItemEdit}
          />
        );
      })}
    </div>
  );
};

BoardList.propTypes = {
  onItemChange: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onItemEdit: PropTypes.func.isRequired
};

/**
 * Component wrapper for the Vision Boards > Boards page.
 */
export default class Boards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      /* Whether or not the GET request for board data has loaded */
      isLoaded: false,

      /* Error text from the board data GET request */
      err: null,

      /* Array of loaded vision board data objects */
      visionBoards: [],

      /* Whether or not the create new vision board modal is open */
      createModalOpen: false,

      /* Key for the create new vision board modal. Key is incremented on modal close to force re-mount */
      createModalKey: 0,

      /* Whether or not the edit vision board modal is open */
      editModalOpen: false,

      /* Key for the edit vision board modal. Key is incremented on modal close to force re-mount */
      editModalKey: 0,

      /* Data for current vision board open in the edit modal */
      editData: undefined
    };

    this.closeCreateModal = this.closeCreateModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);
    this.onCardChangeHandler = this.onCardChangeHandler.bind(this);
    this.loadBoardData = this.loadBoardData.bind(this);
  }

  componentDidMount() {
    this.loadBoardData();
  }

  /**
   * Function to handle when cards request data within the Vision Boards data objects to be changed.
   */
  onCardChangeHandler(id, change) {
    const { visionBoards, editModalKey } = this.state;

    // Attempt to find index of requested ID within the list
    const foundIndex = visionBoards.findIndex(element => element._id === id);

    if (foundIndex !== -1) {
      // Update key value pair
      const newVisionBoards = visionBoards;
      newVisionBoards[foundIndex][change.key] = change.value;
      newVisionBoards[foundIndex].changed = change.value;
      this.setState({
        visionBoards: newVisionBoards,
        /* Force edit modal to re-mount */
        editModalKey: editModalKey + 1
      });
    }
  }

  /**
   * Loads the list of Vision Boards for the authenticated user session.
   *
   * NOTE: Does not load the entire vision board object, only metadata necessary to display cards.
   * NOTE: Clears the current state related to data when function is executed.
   */
  loadBoardData() {
    this.setState({
      isLoaded: false,
      err: null,
      visionBoards: []
    });

    execFetch('/api/visionboard/boards', { method: 'GET' })
      .then(res => res.json())
      .then(res => this.setState({ visionBoards: res }))
      .catch(err => this.setState({ err: err.message }))
      .finally(() => this.setState({ isLoaded: true }));
  }

  /**
   * Callback function for when the CreateModal component exits. Also closes the modal.
   *
   * NOTE: Only reloads the list of vision boards if modal exited with success.
   *
   * @param {boolean} creationSuccess - Whether or not the Vision Boards was successfully created
   */
  closeCreateModal(creationSuccess) {
    const { createModalKey } = this.state;

    // Close modal and generate new modal when existing modal closes
    this.setState({ createModalOpen: false, createModalKey: createModalKey + 1 });

    // If board creation was success, reload board list
    if (creationSuccess) {
      this.loadBoardData();
    }
  }

  /**
   * Callback function for when the EditModal component exits. Also closes the modal.
   *
   * NOTE: Only reloads the list of vision boards if modal exited with success.
   *
   * @param {boolean} editSuccess - Whether or not the Vision Boards was successfully edited
   */
  closeEditModal(editSuccess) {
    // Close edit modal
    this.setState({ editModalOpen: false });

    // If board creation was success, reload board list
    if (editSuccess) {
      this.loadBoardData();
    }
  }

  render() {
    const {
      isLoaded,
      err,
      visionBoards,
      createModalOpen,
      createModalKey,
      editModalOpen,
      editModalKey,
      editData
    } = this.state;

    return (
      <div id="visionboard-boards">
        <div className="header">
          <h1 className="title">Boards</h1>
          <div className="action-group">
            <Button
              content="New Board"
              icon="add"
              labelPosition="left"
              disabled={!isLoaded}
              onClick={() => this.setState({ createModalOpen: true })}
              primary
            />
          </div>
        </div>
        <h2 className="subtitle">Manage and view all your Vision Boards.</h2>
        {/* While load has not completed, display a loading icon */}
        {!isLoaded && (
          <Loader active size="large">
            Loading
          </Loader>
        )}
        {/* On load failure, display error */}
        {isLoaded && err && (
          <Message icon="warning sign" negative header="Something went wrong!" content={err} />
        )}
        {/* On load success show visionboards if there are any */}
        {isLoaded && !err && visionBoards.length > 0 && (
          <BoardList
            items={visionBoards}
            onItemChange={this.onCardChangeHandler}
            reloadBoardData={this.loadBoardData}
            onItemEdit={item =>
              this.setState({
                editModalOpen: true,
                editModalKey: editModalKey + 1,
                editData: item
              })
            }
          />
        )}
        {/* On load success show cta if there are not vision boards */}
        {isLoaded && !err && visionBoards.length === 0 && (
          <Message
            icon="hand peace outline"
            header="Looks like you don't have any Vision Boards yet!"
            content={`Head on over to the "New Board" button in the top right corner to start.`}
          />
        )}
        {/* Modal component for creating a new vision board */}
        <CreateModal
          key={`create-modal-${createModalKey}`}
          open={createModalOpen}
          onClose={this.closeCreateModal}
        />
        {/* Modal component for editing a new vision board */}
        {/* NOTE: Only renders if there is edit data loaded */}
        {editData && (
          <EditModal
            key={`edit-modal-${editModalKey}`}
            open={editModalOpen}
            onClose={this.closeEditModal}
            data={editData}
          />
        )}
      </div>
    );
  }
}
