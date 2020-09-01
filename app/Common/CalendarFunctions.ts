import ical from "ical-generator";
import moment from "moment";
import {engDayCast} from "../../config/words";
import fs from "fs/promises";
import fsS from "fs";
import {glob} from "glob";
import path from "path";

export function errorCalendar()
{
  const cal = ical({domain: 'eatery.nero2k.com', name: 'Eatery Lunchmeny'});

  cal.createEvent({
    start: moment().startOf("week"),
    end: moment().endOf("week"),
    allDay: true,
    summary: `Lunchbot ERROR`,
    // @ts-ignore
    description: "Failed to fetch the calendar, please contact NERO2k (William Helmenius) or wait 12 hours."
  });

  return cal.toString();
}

export function calendarExists() : boolean
{
  if (fsS.existsSync(`../tmp/eatery-calendar.ical`)) {
    return true;
  }
  return false;
}

export async function getCalendar()
{
  if (calendarExists())
  {
    const cal = await fs.readFile(`../tmp/eatery-calendar.ical`);
    return cal.toString()
  }
  return errorCalendar();
}

export async function generateCalendar() : Promise<string>
{
  const cal = ical({domain: 'eatery.nero2k.com', name: 'Eatery Lunchmeny'});

  return new Promise((resolve) => {
    glob(path.join(__dirname, '../../../tmp/*.json'), {}, async (_err, files) => {
      for (const path1 of files) {
        const data = await fs.readFile(path1);
        let json = JSON.parse(data.toString());
        await Object.keys(json.menu).forEach((key) => {
          console.log(key);
          let day = engDayCast[key].charAt(0).toUpperCase() + engDayCast[key].slice(1) || key.charAt(0).toUpperCase() + key.slice(1);
          let momentDay = moment(`${key}-${json.listed_week}-${json.actual_year}`, "dddd-ww-yyyy").add(1, "d");
          cal.createEvent({
            start: momentDay,
            end: momentDay,
            allDay: true,
            summary: `Eatery ${day}`,
            // @ts-ignore
            description: json.menu[key].join("\n"),
            url: `https://eatery.nero2k.com?date=${momentDay.week()}-${momentDay.year()}&format=WW-YYYY`
          });
        });
      }
      resolve(cal.toString())
    })
  })
}


export function deleteCalendar(): void {
  fsS.unlinkSync(`../tmp/eatery-calendar.ical`);
}
