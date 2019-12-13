import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

/**
 * Navigation section which represents the header of the navigation sidebar.
 */
const NavHeader = ({ route, icon, text }) => {
  return (
    <Link to={route}>
      <li className="nav-section nav-header">
        <div className="nav-icon">
          <Icon name={icon} />
        </div>
        <div className="nav-text">
          <p>{text}</p>
        </div>
      </li>
    </Link>
  );
};

export default NavHeader;

NavHeader.propTypes = {
  /* Route to switch to when link is clicked */
  route: PropTypes.string.isRequired,

  /* Icon to display in the header */
  icon: PropTypes.string.isRequired,

  /* Text to display in the header */
  text: PropTypes.string.isRequired
};
