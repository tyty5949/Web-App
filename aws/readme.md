# Deployment Config Documentation

### Dev

This deployment is designed to deploy to a single EC2 instance. The entry point to the application is through NGINX where 
the static files are served. PM2 runs the API as a proxy for NGINX.

- `dev/nginx` - NGINX config files which are copied over to the /etc/nginx/conf.d directory on the NGINX deployment machine.

- `dev/scripts` - AWS CodeDeploy lifecycle scripts.

- `dev/appspec.yml` - AWS CodeDeploy configuration file.
