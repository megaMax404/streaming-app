#!/bin/bash
cd /root/streaming-app || exit

git pull

cd frontend || exit
npm install
npm run build

rm -rf /var/www/doohd/*
cp -r dist/* /var/www/doohd/

systemctl reload nginx

cd ../backend || exit
pm2 restart doohd-api

echo "Deploy complete"