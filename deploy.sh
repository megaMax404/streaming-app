#!/bin/bash

set -x

echo "STEP 1"

cd /root/streaming-app || exit

echo "STEP 2"

git fetch origin

echo "STEP 3"

git reset --hard origin/master

echo "STEP 4"

cd frontend || exit

echo "STEP 5"

npm install

echo "STEP 6"

npm run build

echo "STEP 7"

rm -rf /var/www/doohd/*

echo "STEP 8"

cp -r dist/* /var/www/doohd/

echo "STEP 9"

systemctl reload nginx

echo "STEP 10"

cd ../backend || exit

echo "STEP 11"

pm2 restart doohd-api

echo "DONE"