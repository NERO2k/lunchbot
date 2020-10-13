import fs from "fs";
import { Exception } from "@poppinss/utils";
import Env from "@ioc:Adonis/Core/Env";
import moment, { Moment } from "moment/";
import { blockedWords, sweDayCast, weekDays } from "../../config/words";
import sharp from "sharp";
import got from "got";
import { schemaVersion } from "../../config/schema";
import Menu from "App/Types/Menu";
const strtr = require("locutus/php/strings/strtr");
const tesseract = require("node-tesseract-ocr");

export async function image(url: string | null, body: string | null): Promise<string> {
  const page_url: string = url ? url : <string>Env.get("EATERY_LUNCH_URL");

  if (!body) {
    const request = await got(page_url);
    body = request.body;
  }

  const imgRex = /<img.*?src="(.*?)"[^>]+>/g;
  let img;
  while ((img = imgRex.exec(body))) {
    if (img[1].match("[iI][0-9-]?[0-9-]?\\.[wW][pP]\\.[cC][oO][mM]"))
      return img[1]
        .substring(0, img[1].indexOf("?"))
        .replace(
          /-[0-9-]?[0-9-]?[0-9-]?[0-9-]?[xX][0-9-]?[0-9-]?[0-9-]?[0-9-]?/g,
          ""
        );
  }
  throw new Exception("Det gick inte att skrapa webbadressen från http body.");
}

export async function fetch(
  date: Moment,
  url: string,
  temp: boolean
): Promise<boolean> {
  const filePath = temp
    ? "../tmp/eatery.tif.tmp"
    : `../tmp/eatery-${date.format("YYYY-WW")}.tif`;

  if (!fs.existsSync(filePath) || temp) {
    const sharpStream = sharp();

    await got.stream(url).pipe(sharpStream);

    const contrast = 10;
    const brightness = 1;

    await sharpStream.toFile(filePath.replace(".tif", ".source"));
    await sharpStream.linear(contrast, -(128 * contrast) + 128);
    await sharpStream.modulate({ brightness: brightness });

    await sharpStream.clone().tiff().toFile(filePath);

    return true;
  } else {
    throw new Exception("Veckan har redan skrivits till hårddisken.");
  }
}

export async function ocr(file_path: string): Promise<string> {
  const config = {
    lang: "swe",
    oem: 3,
    psm: 3,
  };

  return new Promise((resolve) =>
    tesseract
      .recognize(file_path, config)
      .then((text: string) => {
        resolve(text);
      })
      .catch((error: string) => {
        throw error;
      })
  );
}

export async function parse(text: string, date: Moment): Promise<object> {
  let data = <Menu>(<any>{ menu: {} });
  let currentDay: string = "";

  const splitLines = text.replace(/\r/g, "").split("\n");
  const cleanLines = splitLines
    .filter(function (entry) {
      return entry.trim() != "";
    })
    .filter(function (entry) {
      let count = 0;
      const split = entry.split(" ");
      split.forEach((string) => {
        if (string.length <= 3) count++;
      });
      return count !== split.length;
    });

  data["schema_version"] = schemaVersion;

  for (let i = 0; i < cleanLines.length; i++) {
    if (!data["listed_week"]) {
      let listedWeek = (cleanLines[i].match(/\d+/g) || [""]).map(Number)[0];
      if (listedWeek < 53) {
        data["listed_week"] = listedWeek;
      }
    }
    if (
      !blockedWords.some(function (v) {
        return cleanLines[i].toLowerCase().indexOf(v) >= 0;
      })
    ) {
      if (
        !weekDays.some(function (v) {
          return (
            strtr(cleanLines[i].toLowerCase(), "åäö", "aao").indexOf(v) >= 0 &&
            cleanLines[i].split(" ").length < 2
          );
        })
      ) {
        if (currentDay !== "") {
          let menuDayLine = /[.!?]$/.test(cleanLines[i])
            ? cleanLines[i]
            : cleanLines[i] + ".";
          data.menu[currentDay].push(menuDayLine);
        }
      } else {
        let day: string = strtr(
          cleanLines[i].toLowerCase().replace(/[^a-öA-Ö0-9]/, ""),
          "åäö",
          "aao"
        );
        currentDay = sweDayCast[day] || day;
        data.menu[currentDay] = data.menu[currentDay] || [];
      }
    }
  }

  data["iteration_week"] = Number(moment().format("WW"));
  data["iteration_year"] = Number(moment().format("YYYY"));
  data["actual_week"] = Number(date.format("WW"));
  data["actual_year"] = Number(date.format("YYYY"));

  return data;
}
