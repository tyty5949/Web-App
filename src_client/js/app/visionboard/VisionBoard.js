import React from 'react';
import { Breadcrumb, Button, Loader, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { VisionBoardContext } from 'contexts/VisionBoard';
import { execFetch } from '../../util/FetchUtil';
import VendorDirectoryBoardCard from './vendordirectory/VendorDirectoryBoardCard';
import PhotoBoard from './PhotoBoard';
import 'less/visionboard/VisionBoard.less';

export default class VisionBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      err: null,
      data: null
    };

    // eslint-disable-next-line react/prop-types
    this.boardId = props.match.params.id;
  }

  componentDidMount() {
    this.loadBoardData();
  }

  loadBoardData() {
    this.setState({
      isLoaded: false,
      err: null,
      data: null
    });

    execFetch(`/api/visionboard/boards/${this.boardId}`, { method: 'GET' })
      .then(res => res.json())
      .then(res => this.setState({ data: res }))
      .catch(err => this.setState({ err: err.message }))
      .finally(() => this.setState({ isLoaded: true }));
  }

  render() {
    const { isLoaded, err, data } = this.state;

    return (
      <VisionBoardContext.Provider value={data}>
        <div id="visionboard">
          <div className="header">
            <Breadcrumb size="massive">
              <Breadcrumb.Section>
                <Link to="/vision/boards">Boards</Link>
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right angle" />
              {isLoaded && data && (
                <Breadcrumb.Section className="board-title delay-100-0" content={data.title} />
              )}
            </Breadcrumb>
            <div className="action-group">
              <Button
                content="Add Module"
                icon="add"
                labelPosition="left"
                disabled={!isLoaded}
                primary
              />
              <Button icon="cogs" disabled={!isLoaded} />
            </div>
          </div>
          <h2 className="subtitle">Plan the perfect event with your personalized Vision Board!</h2>

          {/* On load error, display error message */}
          {isLoaded && err && (
            <Message icon="warning sign" negative header="Something went wrong!" content={err} />
          )}

          {/* On load success, display vision board content */}
          {isLoaded && !err && (
            <div className="dashboard-container">
              <PhotoBoard />
              <VendorDirectoryBoardCard defaultEntries={data.vendorDirectoryEntries} />
            </div>
          )}

          {/* While load has not completed, display a loading icon */}
          {!isLoaded && (
            <Loader active size="large">
              Loading
            </Loader>
          )}
        </div>
      </VisionBoardContext.Provider>
    );
  }
}
