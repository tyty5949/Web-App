import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
const Dashboard = React.lazy(() => import('./dashboard/Dashboard'));
const VisionOverview = React.lazy(() => import('./visionboard/Overview'));
const VisionBoards = React.lazy(() => import('./visionboard/boards/Boards'));
const VisionBoard = React.lazy(() => import('./visionboard/VisionBoard'));
const Settings = React.lazy(() => import('./settings/Settings'));

/**
 * Component which wraps all the client side routes for the React application.
 *
 * When adding a new client side route, be sure that it is placed within the #content div so that
 * it renders in the correct grid area.
 */
const Routes = () => {
  return (
    <div id="content">
      <Suspense fallback={<div className="loading"></div>}>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/vision/overview" component={VisionOverview} />
          <Route path="/vision/boards" component={VisionBoards} exact />
          <Route path="/vision/boards/:id" component={VisionBoard} />
          <Route path="/settings" component={Settings} />
          <Redirect exact from="/" to="/dashboard" />
        </Switch>
      </Suspense>
    </div>
  );
};

export default Routes;
