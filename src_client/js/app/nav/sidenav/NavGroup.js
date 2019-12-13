import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

/**
 * Component for a group of items in the side navigation. The nav group switches to the first
 * item's route when it is clicked. The group is only expanded when the current route is on
 * one of the items it displays, otherwise the nav items are hidden.
 */
const NavGroup = ({ route, icon, text, items, location }) => {
  /* Group is expanded if current route starts with the route prefix for this group */
  const expanded = location.pathname.startsWith(route);

  /* Default route to link to when the group section is clicked */
  const defaultRoute = route + items[0].route;

  return (
    <>
      <Link to={defaultRoute}>
        <li className={`nav-section nav-group ${expanded ? ' nav-group-selected' : ''}`}>
          <div className="nav-icon">
            <Icon name={icon} />
          </div>
          <div className="nav-text">
            <p>{text}</p>
          </div>
          <div className="nav-group-angle">
            {/* Displays up angle if group is expanded, displays down angle otherwise */}
            <Icon name={expanded ? 'angle up' : 'angle down'} />
          </div>
        </li>
      </Link>

      {/* Render all item within the group only if the group is expanded */}
      {expanded && (
        <>
          {items.map(item => {
            const itemRoute = route + item.route;
            return <NavItem key={item.route} route={itemRoute} icon={item.icon} text={item.text} />;
          })}
        </>
      )}
    </>
  );
};

NavGroup.propTypes = {
  /* Route prefix for this group */
  route: PropTypes.string.isRequired,

  /* Icon to display in the group */
  icon: PropTypes.string.isRequired,

  /* Text to display for the group */
  text: PropTypes.string.isRequired,

  /* Array of items to display within the group */
  items: PropTypes.arrayOf(
    PropTypes.exact({
      /* Route to switch to when the item link is clicked */
      route: PropTypes.string.isRequired,

      /* Text to display in the item */
      text: PropTypes.string.isRequired
    })
  ).isRequired,

  /* Prop from React Router context */
  location: PropTypes.shape({
    /* The pathname for the current route */
    pathname: PropTypes.string
  }).isRequired
};

/**
 * Component for each of the items within the nav group.
 */
const NavItem = ({ route, text }) => {
  return (
    <NavLink to={route} activeClassName="selected">
      <li className="nav-section nav-group-item">
        <div className="nav-text">
          <p>{text}</p>
        </div>
      </li>
    </NavLink>
  );
};

NavItem.propTypes = {
  /* Route to switch to when link is clicked */
  route: PropTypes.string.isRequired,

  /* Text to display in the header */
  text: PropTypes.string.isRequired
};

/* Export NavGroup with router context so the component has access to location prop */
export default withRouter(NavGroup);
