# API Backend Documentation

## Directory/File Structure

- `/controllers` - Route controllers for Express.js services.
- `/schemas` - Mongoose schemas for MongoDB documents.
- `/util` - Utility modules used throughout the application.
- `app.js` - Main entrypoint for the API server application.

## Adding a Controller Service

1. Create a new directory for your service within `/controllers` following the naming convention.
2. Add an `index.js` file within your service directory which should export a single Express.js `Router` instance for
your service's routes.
3. Within the `/controllers/index.js` file add your service to the `router` instance. This router will be served by
the Express.js server.

**NOTE:** All services that function as API routes should be prefixed with `/api/<service_name>`.

## Adding a Model

We use the Mongoose ORM to manage database models within out program.

1. Create a `<model>.js` file within the `/models`/ directory.
2. Write your Schema and export a new Model instance with `Mongoose.model(...)`.
3. `require` your module within the `models/index.js` file to have it automatically included in the Mongoose instance used
by our server.
