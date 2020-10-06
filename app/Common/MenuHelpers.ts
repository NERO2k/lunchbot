import * as fs from "fs";
import * as fsA from "fs/promises";
import {schemaVersion} from "../../config/schema";

export async function isWeekUpdated(date) : Promise<boolean> {
  const rawData = await fsA.readFile(`../tmp/eatery-${date.format("YYYY-WW")}.json`);
  const data = JSON.parse(rawData.toString());
  if (data.schema_version !== schemaVersion) {
    fs.unlinkSync(`../tmp/eatery-${date.format("YYYY-WW")}.json`);
    return false;
  }
  return true;
}

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
