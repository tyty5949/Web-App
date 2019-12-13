source /home/ec2-user/.bash_profile

# Start the Node.js server
cd /var/node || exit 1
pm2 start app.js -i max --time --name "bw-api" --restart-delay 5000

# Start NGINX service
sudo service nginx start
