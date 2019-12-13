import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { execFetch } from '../../../util/FetchUtil';

/**
 * A single Vision Boards Card component which renders metadata about the vision board.
 */
const BoardListCard = ({ onChange, delayIndex, data, onEdit }) => {
  const { _id, title, iconImage, favorite, changed, eventDate } = data;

  // Parse the event data to a formatted string
  const date = new Date(Date.parse(eventDate));
  const eventDateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  /**
   * Function to update the vision board's favorite status when the favorite button is pressed.
   */
  const setBoardFavorite = () => {
    // Request change on data object from parent
    onChange(_id, { key: 'favorite', value: !favorite });

    // Push favorite update to the server
    execFetch(`/api/visionboard/boards/${_id}`, {
      method: 'PUT',
      body: JSON.stringify({ favorite: !favorite }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  return (
    <>
      <div className={`card delay-20-${delayIndex}`}>
        {/* Card image */}
        <Link to={`/vision/boards/${_id}`}>
          <Image
            src={
              iconImage ||
              'https://d3kytspwoe5jkf.cloudfront.net/static/square-image-placeholder.png'
            }
            circular
          />
        </Link>

        {/* Card text group */}
        <Link to={`/vision/boards/${_id}`} className="text-group">
          <h1>{title}</h1>
          {eventDate ? <h2>{eventDateString}</h2> : <br />}
        </Link>

        {/* Card action group */}
        <div className="action-group">
          <button
            type="button"
            className={(favorite ? 'favorite' : '') + (changed ? ' changed' : '')}
            onClick={setBoardFavorite}
          >
            <Icon name={`star${favorite ? '' : ' outline'}`} />
          </button>
          <button type="button" onClick={onEdit.bind(null, data)}>
            <div className="edit">
              <Icon name="cog" />
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

BoardListCard.propTypes = {
  /**
   * Callback function for when the board list card has changed and is requesting that the board
   * data be updated.
   * @param {string} _id - The id of the vision board being changed
   * @param {key} string - The key in the vision board data object which has been changed
   * @param value - The value which the key in the vision board data object has changed to
   */
  onChange: PropTypes.func.isRequired,

  /**
   * Number to use for animation delay indexing.
   */
  delayIndex: PropTypes.number.isRequired,

  /**
   * Vision board data object for the card to display.
   * @see ~/src_server/models/visionboard.js
   */
  data: PropTypes.object.isRequired,

  /** Callback function for when the card edit button is pressed */
  onEdit: PropTypes.func.isRequired
};

export default BoardListCard;
