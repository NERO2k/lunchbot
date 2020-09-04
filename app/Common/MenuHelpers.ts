import * as fs from "fs";

export function hasWeekImage(date): boolean {
  return fs.existsSync(`../tmp/eatery-${date.format("YYYY-WW")}.tif`);
}
export function isWeekStringified(date): boolean {
  return fs.existsSync(`../tmp/eatery-${date.format("YYYY-WW")}.txt`);
}

export function isWeekParsed(date): boolean {
  return fs.existsSync(`../tmp/eatery-${date.format("YYYY-WW")}.json`);
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
