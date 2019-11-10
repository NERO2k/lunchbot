#!/usr/bin/env bash

apt update -y
apt full-upgrade -y
apt install -y tesseract-ocr node-gyp make
curl -O https://github.com/tesseract-ocr/tessdata/raw/4.00/swe.traineddata
mv swe.traineddata /usr/share/tesseract-ocr/4.00/tessdata

npm i -g yarn
cp .env.example .env

yarn install

echo Done!
