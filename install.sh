#!/usr/bin/env bash

echo Updating system packages.
apt update -y
apt full-upgrade -y

echo Installing system dependencies.
apt install -y tesseract-ocr node-gyp make

echo Downloading tesseract data.
curl -O https://github.com/tesseract-ocr/tessdata_best/raw/master/swe.traineddata
mv swe.traineddata /usr/share/tesseract-ocr/4.00/tessdata

echo Installing yarn.
npm i -g yarn

echo Moving env file.
cp .env.example .env

echo Installing node packages.
yarn install

echo Building app files.
node ace build

echo Done!
echo You need to insert an app key into your env file to be able to run the app.
echo You can generate it using the command 'node ace generate:key'
