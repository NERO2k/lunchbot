import * as fs from "fs";

export function hasWeekImage(date) : boolean
{
  if (fs.existsSync(`../tmp/eatery-${date.format("YYYY-WW")}.png`)) {
    return true;
  }
  return false;
}
export function isWeekStringified(date) : boolean
{
  if (fs.existsSync(`../tmp/eatery-${date.format("YYYY-WW")}.txt`)) {
    return true;
  }
  return false;
}

export function isWeekParsed(date) : boolean
{
  if (fs.existsSync(`../tmp/eatery-${date.format("YYYY-WW")}.json`)) {
    return true;
  }
  return false;
}