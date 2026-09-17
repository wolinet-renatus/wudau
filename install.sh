#!/bin/bash

# Update and clear screen
sudo apt update && clear

# Get public IP address
get_public_ip=$(wget -T 10 -t 1 -4qO- "http://ip1.dynupdate.no-ip.com/" || curl -m 10 -4Ls "http://ip1.dynupdate.no-ip.com/" | grep -m 1 -oE '^[0-9]{1,3}(\.[0-9]{1,3}){3}$')
read -p "Public IPv4 address / hostname [$get_public_ip]: " public_ip
until [[ -n "$get_public_ip" || -n "$public_ip" ]]; do
    echo "Invalid input."
    read -p "Public IPv4 address / hostname: " public_ip
done
[[ -z "$public_ip" ]] && public_ip="$get_public_ip"
clear

# Update and clear screen
sudo apt update
sudo apt upgrade -y
clear

# Install Node.js
echo "
################################################
#                INSTALL NODEJS                #
################################################
"
sudo apt install curl -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install v18.20.2
node -v

# Set up application configuration
read -p "Your sub-domain (admin.yourdomain.com): " your_domain

read -p "Your app name: " app_name

# Mongodb User Name
mongodbUser_name=$(echo "$app_name" | tr '[:upper:]' '[:lower:]' | tr -d ' ')
echo "Your mongodb user name formatted: $mongodbUser_name"

get_shared_secret_key="5TIvw5cpc0"
read -p "Shared Secret key [5TIvw5cpc0]: " shared_secret_key
[[ -z "$shared_secret_key" ]] && shared_secret_key="$get_shared_secret_key"

get_shared_jwt_secret="2FhKmINItB"
read -p "Shared Jwt Secret [2FhKmINItB]: " shared_jwt_secret
[[ -z "$shared_jwt_secret" ]] && shared_jwt_secret="$get_shared_jwt_secret"

clear

# Install Nginx
echo "
################################################
#                INSTALL NGINX                 #
################################################
"
sudo apt install -y nginx
sudo systemctl status nginx
clear

# Configure Nginx
echo "
################################################
#                CONFIGURE NGINX               #
################################################
"
sudo tee /etc/nginx/sites-available/default > /dev/null << EOF
server {
    server_name $your_domain www.$your_domain;
    client_max_body_size 300M;

    access_log /var/log/nginx/$mongodbUser_name.access.log;
    error_log /var/log/nginx/$mongodbUser_name.error.log;

    root /path;

    location /_next/static/ {
        alias /var/www/$mongodbUser_name/frontend/.next/static/;
        expires 365d;
        access_log off;
    }

    location /storage/ {
        proxy_pass http://localhost:5000/storage/; # Node.js backend port
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_redirect off;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Nginx-Proxy true;
    }

    location /admin {
        proxy_pass http://localhost:5000; # Node.js backend port
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_redirect off;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Nginx-Proxy true;
    }

    location /client {
        proxy_pass http://localhost:5000; # Node.js backend port
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_redirect off;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Nginx-Proxy true;
    }

    location /socket.io/ {
        proxy_pass http://localhost:5000; # Node.js backend port
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_redirect off;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Nginx-Proxy true;
    }

    location / {
        proxy_pass http://localhost:5001; # Next.js frontend port
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_redirect off;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Nginx-Proxy true;
    }
}
EOF
sudo systemctl restart nginx
sudo systemctl status nginx
clear

# Secure Nginx with Let's Encrypt 
echo "
################################################
#      Secure Nginx with Let's Encrypt         #
################################################
"
cd ../..
sudo snap install core; sudo snap refresh core
sudo apt remove certbot
sudo snap install --classic certbot
sudo systemctl reload nginx
sudo certbot --nginx -d $your_domain
clear

# Install PM2
echo "
################################################
#                INSTALL PM2                   #
################################################
"
sudo apt install npm -y
npm install pm2 -g
clear

# Install MongoDB
echo "
################################################
#                INSTALL MONGODB               #
################################################
"
sudo apt install software-properties-common gnupg apt-transport-https ca-certificates -y
curl -fsSL https://pgp.mongodb.com/server-7.0.asc |  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee -a /etc/apt/sources.list
sudo apt update
sudo apt install mongodb-org -y
mongod --version
sudo systemctl start mongod
sudo ss -pnltu | grep 27017
sudo systemctl enable mongod

# Wait for MongoDB to start
sleep 10

# Create admin user
mongosh <<EOF
use admin
db.createUser({user:"admin", pwd:"dbadmin123", roles: [{ role: "userAdminAnyDatabase", db: "admin" }, { role: "readWrite", db: "$mongodbUser_name" }]})
exit
EOF

# Enable authentication in MongoDB
sudo sed -i '/#security:/a\security:\n  authorization: enabled' /etc/mongod.conf
sudo sed -i "s/bindIp: 127.0.0.1/bindIp: 127.0.0.1,$public_ip/" /etc/mongod.conf
sudo systemctl restart mongod

# Install backend dependencies
echo "
################################################
#                INSTALL BACKEND               #
################################################
"
cd /home/admin/backend || exit
npm install
cat > .env << EOF
#Port
PORT = 5000

#Project Name
projectName = ${app_name}

#Secret key for jwt
JWT_SECRET = ${shared_jwt_secret}

#Gmail credentials for send email
EMAIL = kodebookapp@gmail.com
APP_PASSWORD = nohwrpybgiuhqjfy 

#Server URL
baseURL = https://$your_domain/

#Secret key for API
secretKey = ${shared_secret_key}

#Mongodb string
MongoDb_Connection_String = mongodb://admin:dbadmin123@${public_ip}:27017/${mongodbUser_name}?authSource=admin
EOF

cd /home/admin/backend || exit
pm2 start index.js --name backend
pm2 status
node -v
pm2 restart backend --interpreter $(which node)

# Install frontend dependencies and build
echo "
################################################
#                INSTALL FRONTEND              #
################################################
"
cd /home/admin/frontend/src/util || exit
cat > config.ts << EOF
export const baseURL: string = "https://$your_domain/";
export const secretKey: string = "$shared_secret_key";
export const projectName: string = "$app_name";
EOF

cd /var/www || exit
sudo mkdir -p "$mongodbUser_name/frontend"
sudo mv /home/admin/frontend/* /var/www/$mongodbUser_name/frontend/
export PATH="$PATH:$HOME/.nvm/versions/node/v18.20.2/bin"
source ~/.bashrc
cd /var/www/$mongodbUser_name/frontend || exit
npm install
npm run build

# Start frontend with PM2
pm2 start npm --name "frontend" -- start
pm2 restart frontend --interpreter $(which node)

echo "
################################################
#                CONGRATULATIONS!              #
################################################
Server setup is complete.
1. baseURL : https://$your_domain/
2. Secret key : $shared_secret_key
3. MONGODB_CONNECTION_STRING: "mongodb://admin:dbadmin123@${public_ip}:27017/${mongodbUser_name}?authSource=admin"
"