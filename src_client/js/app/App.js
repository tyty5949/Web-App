/* eslint import/no-named-as-default: 0 */
/* eslint import/no-named-as-default-member: 0 */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import SideNav from './nav/sidenav/SideNav';
import TopNav from './nav/topnav/TopNav';
import Routes from './Routes';
import 'semantic-ui-theme/semantic.less';
import 'less/App.less';

/**
 * Entry point into the application. Wraps all app components within itself.
 */
const App = React.memo(() => {
  return (
    <BrowserRouter basename="/">
      <SideNav />
      <TopNav />

      {/* To add/edit a route, see 'src/js/components/app/Routes.js' */}
      <Routes />
    </BrowserRouter>
  );
});

export default App;
