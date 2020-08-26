import {hasWeekImage, isWeekParsed, isWeekStringified} from "./MenuHelpers";
import {promises as fs} from "fs";
import {ocr, fetch, image, parse} from "./MenuFunctions";

export async function getMenu(date) : Promise<object> {
  if (!hasWeekImage(date))
  {
    const imageURL = await image(null);
    await fetch(date, imageURL)
  }
  let menuString:string;
  if (!isWeekStringified(date))
  {
    menuString = await ocr(`../tmp/eatery-${date.format("YYYY-WW")}.png`)
    await fs.writeFile(`../tmp/eatery-${date.format("YYYY-WW")}.txt`, menuString);
  } else {
    menuString = await fs.readFile(`../tmp/eatery-${date.format("YYYY-WW")}.txt`)
  }
  let menuObject:object;
  if (!isWeekParsed(date))
  {
    menuObject = await parse(menuString.toString())
    await fs.writeFile(`../tmp/eatery-${date.format("YYYY-WW")}.json`, JSON.stringify(menuObject));
  } else {
    const menuText = await fs.readFile(`../tmp/eatery-${date.format("YYYY-WW")}.json`)
    menuObject = JSON.parse(menuText.toString().replace(/\\r/g, ""))
  }
  return menuObject;
}
