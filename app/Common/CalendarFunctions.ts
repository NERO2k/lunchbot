import ical from "ical-generator";
import moment from "moment";
import {engDayCast} from "../../config/words";
import * as fs from "fs/promises";
import fsS from "fs";
import { glob } from "glob";
import path from "path";
import {fileToDateString, getMenu} from "App/Common/HelperFunctions";
import Menu from "App/Types/Menu";

export function errorCalendar() {
  const cal = ical({ domain: "eatery.nero2k.com", name: "Eatery Lunchmeny" });

  cal.prodId({
    company: "nero2k.com",
    product: "lunchbot",
    language: "SV",
  });

  cal.createEvent({
    start: moment().startOf("week"),
    end: moment().endOf("week"),
    allDay: true,
    summary: `Lunchbot ERROR`,

    description:
      "Failed to fetch the calendar, please contact NERO2k (William Helmenius) or wait 12 hours.",
  });

  return cal.toString();
}

export function calendarExists(): boolean {
  if (fsS.existsSync(`../tmp/eatery-calendar.ical`)) {
    return true;
  }
  return false;
}

export async function getCalendar() {
  if (calendarExists()) {
    const cal = await fs.readFile(`../tmp/eatery-calendar.ical`);
    return cal.toString();
  }
  return errorCalendar();
}

export async function generateCalendar(data:Menu | null = null): Promise<string> {
  const cal = ical({ domain: "eatery.nero2k.com", name: "Eatery Lunchmeny" });

  cal.prodId({
    company: "nero2k.com",
    product: "lunchbot",
    language: "SV",
  });

  let listedWeeks: { [key: string]: boolean } = {};

  return new Promise((resolve) => {
    glob(
      path.join(__dirname, "../../../tmp/*.json"),
      {},
      async (_err, files) => {
        for (const path1 of files) {
          const fileDate = moment(fileToDateString(path1), "YYYY-WW")
          const json = data || await getMenu(fileDate, false, true);

          if (!listedWeeks[`${json.listed_week}-${json.actual_year}`]) {
            await Object.keys(json.menu).forEach((key:string) => {
              let day =
                engDayCast[key].charAt(0).toUpperCase() +
                engDayCast[key].slice(1) ||
                key.charAt(0).toUpperCase() + key.slice(1);
              let momentDay = moment(
                `${key}-${json.listed_week}-${json.actual_year}`,
                "dddd-ww-yyyy"
              );
              if (momentDay.isValid()) {
                cal.createEvent({
                  start: momentDay.startOf("day"),
                  end: momentDay.endOf("day"),
                  allDay: true,
                  summary: `Eatery ${day}`,
                  location: `EATERY KISTA NOD — MENY VECKA ${json.listed_week}`,

                  description: json.menu[key].join("\n")+(json.menu["other"] ? "\n\n"+json.menu["other"].join("\n") : ""),
                  url: `https://eatery.nero2k.com?date=${momentDay.format(
                    "WW"
                  )}-${momentDay.year()}&format=WW-YYYY`,
                });
                listedWeeks[`${json.listed_week}-${json.actual_year}`] = true;
              }
            });
          }
        }
        resolve(cal.toString());
      }
    );
  });
}

export function deleteCalendar(): void {
  if (fsS.existsSync(`../tmp/eatery-calendar.ical`))
  fsS.unlinkSync(`../tmp/eatery-calendar.ical`);
}
