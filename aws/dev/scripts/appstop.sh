source /home/ec2-user/.bash_profile

# Stop NGINX service
sudo service nginx stop

# Stop Node.js service
pm2 stop all
