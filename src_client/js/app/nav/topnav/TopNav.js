import React from 'react';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import 'less/nav/TopNav.less';

/**
 * Component wrapper for the top navigation. Top nav Contains search bar.
 */
const TopNav = () => {
  return (
    <div id="topnav">
      <div className="search-bar">
        <Input fluid icon="search" iconPosition="left" placeholder="Search..." />
      </div>
    </div>
  );
};

export default TopNav;
