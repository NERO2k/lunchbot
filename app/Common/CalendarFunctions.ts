import ical from "ical-generator";
import moment from "moment";
import { engDayCast } from "../../config/words";
import * as fs from "fs/promises";
import fsS from "fs";
import { glob } from "glob";
import path from "path";

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
    // @ts-ignore
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

export async function generateCalendar(): Promise<string> {
  const cal = ical({ domain: "eatery.nero2k.com", name: "Eatery Lunchmeny" });
  let listedWeeks = [];

  return new Promise((resolve) => {
    glob(
      path.join(__dirname, "../../../tmp/*.json"),
      {},
      async (_err, files) => {
        for (const path1 of files) {
          const data = await fs.readFile(path1);
          let json = JSON.parse(data.toString());
          if (!listedWeeks[`${json.listed_week}-${json.actual_year}`]) {
            await Object.keys(json.menu).forEach((key) => {
              let day =
                engDayCast[key].charAt(0).toUpperCase() +
                  engDayCast[key].slice(1) ||
                key.charAt(0).toUpperCase() + key.slice(1);
              let momentDay = moment(
                `${key}-${json.listed_week}-${json.actual_year}`,
                "dddd-ww-yyyy"
              );
              cal.createEvent({
                start: momentDay.startOf("day"),
                end: momentDay.endOf("day"),
                allDay: true,
                summary: `Eatery ${day}`,
                location: `EATERY KISTA NOD — MENY VECKA ${json.listed_week}`,
                // @ts-ignore
                description: json.menu[key].join("\n"),
                url: `https://eatery.nero2k.com?date=${momentDay.format(
                  "WW"
                )}-${momentDay.year()}&format=WW-YYYY`,
              });
              listedWeeks[`${json.listed_week}-${json.actual_year}`] = true;
            });
          }
        }
        resolve(cal.toString());
      }
    );
  });
}

export function deleteCalendar(): void {
  fsS.unlinkSync(`../tmp/eatery-calendar.ical`);
}
