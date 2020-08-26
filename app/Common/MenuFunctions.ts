import fs from "fs";
import axios from "axios";
import {Exception} from "@poppinss/utils";
import Env from "@ioc:Adonis/Core/Env";
import tesseract from 'node-tesseract-ocr'
import moment from 'moment'

export async function image(url) : Promise<string>
{
  const page_url = url ? url : Env.get("LUNCHBOT_URL")

  const request = await axios.get(page_url);
  const imgRex = /<img.*?src="(.*?)"[^>]+>/g;
  let img;
  while ((img = imgRex.exec(request.data))) {
    if (img[1].includes("i1.wp.com"))
      return img[1].substring(0, img[1].indexOf('?'));
  }
  throw new Exception("Failed scrape image url from http body.");
}

export async function fetch(date, url) : Promise<boolean>
{
  const fpath = `../tmp/eatery-${date.format('YYYY-WW')}.png`

  if (!fs.existsSync(fpath)) {
    const writer = fs.createWriteStream(fpath)
    writer.on('error', () => {
      throw new Exception('Failed to write the Eatery menu.')
    })

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })

    if (response.status === 200) {
      await response.data.pipe(writer)
      return true;
    } else {
      throw new Exception("Failed to fetch menu.");
    }
  } else {
    throw new Exception("Week has already been written to drive.")
  }
}

export async function ocr(file_path) : Promise<string>
{
  const config = {
    lang: 'swe',
    oem: 3,
    psm: 3
  }

  return new Promise((resolve) =>
    tesseract
    .recognize(file_path, config)
    .then(text => {
      resolve(text)
    })
    .catch(error => {
      throw error;
    })
  );
}

export async function parse(text) : Promise<object>
{
  let data = {menu:{}}
  let currentDay;

  const blocked = ["borgarfsjordsgatan", "borgarfsjordgatan", "kista", "bröd", "eaterykortet", "trevlig", "eatery"]
  const days = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const dayCast = {"måndag": "monday", "tisdag": "tuesday", "onsdag": "wednesday", "torsdag": "thursday", "fredag": "friday", "lördag": "saturday", "söndag": "sunday"}

  const splitLines = text.split("\n");
  const cleanLines = splitLines.filter(function(entry) {
    return entry.trim() != '';
  }).filter(function(entry) {
    let count = 0
    const split = entry.split(" ");
    split.forEach((string) => {
       if (string.length <= 3) count++
     })
    return count !== split.length;
  });

  data["actual_week"] = Number(moment().format("WW"))
  for (let i = 0; i < cleanLines.length; i++) {
    if (!data["listed_week"]) {
      let listedWeek = (cleanLines[i].match(/\d+/g) || [null]).map(Number)[0];
      if (listedWeek < 53) {
        data["listed_week"] = listedWeek;
      }}
    if (!blocked.some(function(v) {
      return cleanLines[i].toLowerCase().indexOf(v) >= 0;
    })) {
      if (!days.some(function(v) {
        return cleanLines[i].toLowerCase().indexOf(v) >= 0 && cleanLines[i].split(" ").length < 2;
      })) {
        if (currentDay)
          data.menu[currentDay].push(cleanLines[i])
      } else {
        let day = cleanLines[i].toLowerCase();
        currentDay = dayCast[day] || day;
        data.menu[currentDay] = data[currentDay] || []
      };
    }
  }

  return data;
}
