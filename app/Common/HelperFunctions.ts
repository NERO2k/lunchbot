import {hasWeekImage, isWeekParsed, isWeekStringified} from "./MenuHelpers";
import {promises as fs} from "fs";
import {ocr, fetch, image, parse} from "./MenuFunctions";
import {Exception} from "@poppinss/utils";
import moment from "moment/";

export async function getMenu(date, allowFetch, cache) : Promise<object> {
  if (!hasWeekImage(date) || cache)
  {
    if (allowFetch !== true)
      throw new Exception("You are not allowed to fetch menus that aren't cached. Please contact the server administrator.")
    if (date.format("YYYY-WW") !== moment().format("YYYY-WW"))
      throw new Exception("This menu was not found on the server and is also not available via eatery.")
    const imageURL = await image(null);
    await fetch(date, imageURL, !cache)
  }
  let menuString:string;
  if (!isWeekStringified(date) || cache)
  {
    menuString = await ocr(!cache ? '../tmp/eatery-tmp.png' : `../tmp/eatery-${date.format('YYYY-WW')}.png`)
    await fs.writeFile(!cache ? '../tmp/eatery-tmp.txt' : `../tmp/eatery-${date.format('YYYY-WW')}.txt`, menuString);
  } else {
    let cacheString = await fs.readFile(`../tmp/eatery-${date.format("YYYY-WW")}.txt`)
    menuString = cacheString.toString()
  }
  let menuObject:object;
  if (!isWeekParsed(date) || cache)
  {
    menuObject = await parse(menuString)
    await fs.writeFile(!cache ? '../tmp/eatery-tmp.json' : `../tmp/eatery-${date.format('YYYY-WW')}.json`, JSON.stringify(menuObject));
  } else {
    const menuText = await fs.readFile(!cache ? '../tmp/eatery-tmp.json' : `../tmp/eatery-${date.format('YYYY-WW')}.json`)
    menuObject = JSON.parse(menuText.toString())
  }
  return menuObject;
}
