/**
 * Main entry point for all pages which contain the built bundle.js.
 *
 * When new pages with new React containers are added, render the components here.
 */
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { init as SentryInit } from '@sentry/browser';
import App from './app/App';
const LoginContainer = React.lazy(() => import('./login/LoginContainer'));

// Sentry error tracking
if (process.env.NODE_ENV === 'production') {
  SentryInit({
    dsn: process.env.SENTRY_URL,
    environment: process.env.SENTRY_ENV,
    release: process.env.SENTRY_RELEASE
  });
}

// Render the App component
if (document.getElementById('app')) {
  ReactDOM.render(<App />, document.getElementById('app'));
}

// Render the LoginContainer component
if (document.getElementById('login')) {
  ReactDOM.render(
    <Suspense fallback={<div className="loading"></div>}>
      <LoginContainer />
    </Suspense>,
    document.getElementById('login')
  );
}
