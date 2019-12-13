import React from 'react';
import NavHeader from './NavHeader';
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import 'less/nav/SideNav.less';

/**
 * Component wrapper for the side navigation. Displays list of NavHeader, NavItem, or NavGroup
 * components.
 *
 * Icons are from FontAwesome.
 *
 * Add new NavItems or NavGroups within the .nav-list unordered list.
 */
const SideNav = () => {
  return (
    <div id="sidenav">
      <ul className="nav-list">
        {/* Nav header */}
        <NavHeader route="/dashboard" icon="js" text="App" />

        {/* Dashboard nav item */}
        <NavItem route="/dashboard" icon="columns" text="Dashboard" />

        {/* Vision Board nav group */}
        <NavGroup
          route="/vision"
          icon="th"
          text="Vision Board"
          items={[
            {
              route: '/overview',
              text: 'Overview'
            },
            {
              route: '/boards',
              text: 'Boards'
            }
          ]}
        />

        {/* Settings nav item */}
        <NavItem route="/settings" icon="cog" text="Settings" />
      </ul>
    </div>
  );
};

export default SideNav;
