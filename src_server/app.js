/* eslint no-console: 0 */
/**
 * The Express.js application for the API server.
 */
require('babel-polyfill');
require('node-dogstatsd');
require('dotenv').config();
const path = require('path');
const Express = require('express');
const ExpressSession = require('express-session');
const Mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(ExpressSession);
const Sentry = require('@sentry/node');
const ConnectDatadog = require('connect-datadog');
const { Loggly } = require('winston-loggly-bulk');
const Winston = require('winston');
const ExpressWinston = require('express-winston');
const Webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const Helmet = require('helmet');
const Passport = require('passport');
const AuthenticationService = require('./authentication');
const ControllerService = require('./controllers');

/**
 * --------------------------------------
 *         Startup Logging
 * --------------------------------------
 */
console.log('\x1b[42m%s\x1b[0m', `[${new Date()}] Starting server!`);
if (process.env.NODE_ENV === 'development') {
  console.log('\x1b[33m%s\x1b[0m', 'WARN: Running in DEV mode!');
}

/**
 * --------------------------------------
 *       Express initialization
 * --------------------------------------
 */
// Initialize express application
const app = Express();

/**
 * --------------------------------------
 *        Logging initialization
 * --------------------------------------
 */
// Sentry error reporting
if (process.env.SENTRY_URL) {
  Sentry.init({
    dsn: process.env.SENTRY_URL,
    environment: process.env.SENTRY_ENV || '',
    release: process.env.SENTRY_RELEASE || ''
  });
  app.use(Sentry.Handlers.requestHandler());
}

// Logging to Datadog agent
if (process.env.USE_DATADOG) {
  app.use(
    ConnectDatadog({
      response_code: true,
      tags: [`app:${process.env.SERVER_NAME}`]
    })
  );
}

// Loggly logging w/ winston
if (process.env.LOGGLY_TOKEN) {
  const logglyTransport = new Loggly({
    token: process.env.LOGGLY_TOKEN,
    subdomain: '',
    tags: ['Winston-NodeJS', process.env.LOGGLY_TAG],
    json: true
  });
  Winston.add(logglyTransport);
  app.use(
    ExpressWinston.logger({
      transports: [logglyTransport],
      format: Winston.format.json(),
      meta: true,
      msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
      expressFormat: true,
      colorize: false,
      headerBlacklist: ['accept', 'accept-encoding', 'accept-language', 'connection'],
      responseWhitelist: ['statusCode', 'headers'],
      requestWhitelist: ['method', 'url', 'headers', 'session']
    })
  );
}

/**
 * --------------------------------------
 *       Mongoose initialization
 * --------------------------------------
 */
// @see https://mongoosejs.com/docs/deprecations.html#ensureindex
Mongoose.set('useCreateIndex', true);
// @see https://mongoosejs.com/docs/deprecations.html#findandmodify
Mongoose.set('useFindAndModify', false);

Mongoose.connect(process.env.MONGOOSE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(
  () => {
    console.log('\x1b[32m%s\x1b[0m', 'Mongoose: Successfully connected to mongodb database!');
  },
  err => {
    console.log('\x1b[31m%s\x1b[0m', 'ERROR connecting to Mongoose mongodb database!!');
    console.log(err);
  }
);

// Register mongoose Schemas
require('./models');

/**
 * --------------------------------------
 *      Start webpack dev server
 *       (NODE_ENV=development)
 * --------------------------------------
 */
const webpackConfig =
  process.env.NODE_ENV === 'development' ? require('../webpack.config.js') : undefined;

if (process.env.NODE_ENV === 'development') {
  // reload=true:Enable auto reloading when changing JS files or content
  // timeout=1000:Time from disconnecting from server to reconnecting
  webpackConfig.entry.app.unshift('webpack-hot-middleware/client?reload=true&timeout=1000');

  // Add HMR plugin
  webpackConfig.plugins.push(new Webpack.HotModuleReplacementPlugin());

  const compiler = Webpack(webpackConfig);

  // Enable "webpack-dev-middleware"
  app.use(
    WebpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath
    })
  );

  // Enable "webpack-hot-middleware"
  app.use(WebpackHotMiddleware(compiler));
}

/**
 * --------------------------------------
 *       Express configuration
 * --------------------------------------
 */
// Use JSON parser
app.use(Express.json());

// Use body parser
app.use(Express.urlencoded({ extended: true }));

// Security middleware
app.use(Helmet());

// Use express-session for session management
app.use(
  ExpressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      // Session expires after 24hrs (given in milliseconds)
      maxAge: 24 * 3600 * 1000,
      httpOnly: true
      // TODO: Set 'secure: true' once HTTPS is implemented on site
    },
    store: new MongoStore({
      mongooseConnection: Mongoose.connection,
      // Create TTL indexes on session collection
      autoRemove: 'native',
      // Only save rolling session cookie every 1 hour (given in seconds)
      touchAfter: 3600,
      stringify: false
    })
  })
);

// Initialize passport and open a passport session
app.use(Passport.initialize({}));
app.use(Passport.session({}));

// Use passport local authentication strategy
Passport.use('local', AuthenticationService.localStrategy);

// Serve all controllers
app.use(ControllerService);

// Serve all controllers
app.use(require('./controllers'));

// Serve app.html if in DEV mode
if (process.env.NODE_ENV === 'development') {
  // Serve app.html to all other non-registered routes
  app.get('**', (req, res) => res.sendFile(path.join(__dirname, '../build/app.html')));
}

/**
 * --------------------------------------
 *       Express error handling
 * --------------------------------------
 */
// Sentry error handling
app.use(Sentry.Handlers.errorHandler());

// Override default error handler to not send error stack in response
app.use((err, req, res, next) => {
  res.sendStatus(500);
  next(err);
});

/**
 * --------------------------------------
 *      Start Express application
 * --------------------------------------
 */
app.listen(process.env.EXPRESS_PORT);
