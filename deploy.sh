#!/bin/bash

cd /root/streaming-app || exit

git fetch origin
git reset --hard origin/master

##############################
# FRONTEND
##############################

cd frontend || exit

echo "VITE_API_URL=https://streaming-backend-yzfm.onrender.com" > .env.production

npm install
npm run build

rm -rf /var/www/doohd/*
cp -r dist/* /var/www/doohd/

##############################
# BACKEND
##############################

cd ../backend || exit

npm install

pm2 restart doohd-api

systemctl reload nginx

echo "Deploy Complete"