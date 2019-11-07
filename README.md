# Eatery Bot
The premier discord bot for tracking your favorite lunch establishment.

## How to build.

1. ```apt-get install tesseract-ocr```
2. [Download the training data](https://github.com/tesseract-ocr/tessdata/raw/4.00/swe.traineddata) and add it to /usr/share/tesseract-ocr/4.00/tessdata
3. ```yarn install```
4. Copy the .env.preset preset and rename it to .env
5. Edit it to your liking
6. Set ENV to production if you are placing the bot a on a server
7. ```yarn run build```
8. ```yarn run start```
9. Done.

Or just run ```sudo sh ./install.sh```
