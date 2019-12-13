import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

/**
 * Navigation section which represents an individual nav item within the navigation sidebar.
 */
const NavItem = ({ route, icon, text }) => {
  return (
    <NavLink to={route} activeClassName="selected">
      <li className="nav-section nav-item">
        <div className="nav-icon">
          <Icon name={icon} />
        </div>
        <div className="nav-text">
          <p>{text}</p>
        </div>
      </li>
    </NavLink>
  );
};

export default NavItem;

NavItem.propTypes = {
  /* Route to switch to when link is clicked */
  route: PropTypes.string.isRequired,

  /* Icon to display in the item */
  icon: PropTypes.string.isRequired,

  /* Text to display in the item */
  text: PropTypes.string.isRequired
};
