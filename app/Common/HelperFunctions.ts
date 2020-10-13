import {
  hasWeekImage,
  isWeekParsed,
  isWeekStringified,
  isWeekUpdated,
} from "./MenuHelpers";
import { promises as fs } from "fs";
import { ocr, fetch, image, parse } from "./MenuFunctions";
import { Exception } from "@poppinss/utils";
import { Moment } from "moment";
import Menu from "App/Types/Menu";

export async function getMenu(
  date: Moment,
  allowFetch: boolean,
  cache: boolean
): Promise<Menu> {
  if (!hasWeekImage(date) || !cache) {
    if (!allowFetch)
      throw new Exception(
        "Du får inte hämta menyer som inte är cachade. Kontakta server administratören om du tror något har gått fel."
      );
    const imageURL = await image(null, null);
    await fetch(date, imageURL, !cache);
  }
  let menuString: string;
  if (!isWeekStringified(date) || !cache) {
    menuString = await ocr(
      !cache
        ? "../tmp/eatery.tif.tmp"
        : `../tmp/eatery-${date.format("YYYY-WW")}.tif`
    );
    await fs.writeFile(
      !cache
        ? "../tmp/eatery.txt.tmp"
        : `../tmp/eatery-${date.format("YYYY-WW")}.txt`,
      menuString
    );
  } else {
    let cacheString = await fs.readFile(
      `../tmp/eatery-${date.format("YYYY-WW")}.txt`
    );
    menuString = cacheString.toString();
  }
  let menuObject: object;
  if (
    !isWeekParsed(date) ||
    !cache ||
    (!(await isWeekUpdated(date)) && cache)
  ) {
    menuObject = await parse(menuString, date);
    await fs.writeFile(
      !cache
        ? "../tmp/eatery.json.tmp"
        : `../tmp/eatery-${date.format("YYYY-WW")}.json`,
      JSON.stringify(menuObject)
    );
  } else {
    const menuText = await fs.readFile(
      !cache
        ? "../tmp/eatery.json.tmp"
        : `../tmp/eatery-${date.format("YYYY-WW")}.json`
    );
    menuObject = JSON.parse(menuText.toString());
  }
  return menuObject as Menu;
}

const falseRegx = /^(?:f(?:alse)?|no?|0+)$/i;
export function booleanParse(val : any, undef: boolean) {
  if (val === undefined) return undef;
  return !falseRegx.test(val) && !!val;
}

export function fileToDateString(data: string) {
  return data.split("eatery-")[1].split(".source")[0];
}
