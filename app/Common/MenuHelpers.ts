import * as fs from "fs";
import * as fsA from "fs/promises";
import { schemaVersion } from "../../config/schema";
import { Moment } from "moment";

export async function isWeekUpdated(date: Moment): Promise<boolean> {
  const rawData = await fsA.readFile(
    `../tmp/eatery-${date.format("YYYY-WW")}.json`
  );
  const data = JSON.parse(rawData.toString());
  return data.schema_version === schemaVersion;
}

export function hasWeekImage(date: Moment): boolean {
  return fs.existsSync(`../tmp/eatery-${date.format("YYYY-WW")}.tif`);
}
export function isWeekStringified(date: Moment): boolean {
  return fs.existsSync(`../tmp/eatery-${date.format("YYYY-WW")}.txt`);
}

export function isWeekParsed(date: Moment): boolean {
  return fs.existsSync(`../tmp/eatery-${date.format("YYYY-WW")}.json`);
}

export function deleteWeekImage(date: Moment): void {
  fs.unlinkSync(`../tmp/eatery-${date.format("YYYY-WW")}.tif`);
}

export function deleteWeekStringified(date: Moment): void {
  fs.unlinkSync(`../tmp/eatery-${date.format("YYYY-WW")}.txt`);
}

export function deleteWeekParsed(date: Moment): void {
  fs.unlinkSync(`../tmp/eatery-${date.format("YYYY-WW")}.json`);
}

export function deleteWeek(date: Moment): void {
  deleteWeekImage(date);
  deleteWeekStringified(date);
  deleteWeekParsed(date);
}
