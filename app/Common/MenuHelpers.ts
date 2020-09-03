import * as fs from "fs";

export function hasWeekImage(date): boolean {
  if (fs.existsSync(`../tmp/eatery-${date.format("YYYY-WW")}.tif`)) {
    return true;
  }
  return false;
}
export function isWeekStringified(date): boolean {
  if (fs.existsSync(`../tmp/eatery-${date.format("YYYY-WW")}.txt`)) {
    return true;
  }
  return false;
}

export function isWeekParsed(date): boolean {
  if (fs.existsSync(`../tmp/eatery-${date.format("YYYY-WW")}.json`)) {
    return true;
  }
  return false;
}

export function deleteWeekImage(date): void {
  fs.unlinkSync(`../tmp/eatery-${date.format("YYYY-WW")}.tif`);
}

export function deleteWeekStringified(date): void {
  fs.unlinkSync(`../tmp/eatery-${date.format("YYYY-WW")}.txt`);
}

export function deleteWeekParsed(date): void {
  fs.unlinkSync(`../tmp/eatery-${date.format("YYYY-WW")}.json`);
}

export function deleteWeek(date): void {
  deleteWeekImage(date);
  deleteWeekStringified(date);
  deleteWeekParsed(date);
}
