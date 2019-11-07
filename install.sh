apt-get install tesseract-ocr
wget 'https://github.com/tesseract-ocr/tessdata/raw/4.00/swe.traineddata'
sudo mv ./swe.traineddata /usr/share/tesseract-ocr/4.00/tessdata/swe.traineddata
npm install yarn -g
mv .env-example .env
yarn run build

echo Done!
