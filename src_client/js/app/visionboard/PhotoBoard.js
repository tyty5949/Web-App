import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

export default class PhotoBoard extends React.Component {
  render() {
    return (
      <div className="photo-bard card delay-100-1">
        <div className="card-header">
          <h1>Photo Board</h1>
          <div className="action-group">
            <Button content="Add" icon="plus" size="mini" labelPosition="left" />
            <Icon name="cog" />
          </div>
        </div>
        <div className="horizontal-rule" />
      </div>
    );
  }
}
