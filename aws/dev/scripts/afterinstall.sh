source /home/ec2-user/.bash_profile

# Set required permissions
sudo chown -R ec2-user:ec2-user /var/node
sudo chmod 664 /etc/systemd/system/app-api.service

# Install Node.js server dependencies
cd /var/node
npm install --production
