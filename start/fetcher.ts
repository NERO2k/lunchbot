import { spawn } from "child_process";
import { getMenu } from "App/Common/HelperFunctions";
import moment from "moment";
import Logger from "@ioc:Adonis/Core/Logger";
import { deleteWeek, hasWeekImage } from "App/Common/MenuHelpers";
import { deleteCalendar, generateCalendar } from "App/Common/CalendarFunctions";
import * as fs from "fs/promises";
import Event from "@ioc:Adonis/Core/Event";

const ls = spawn("node", ["../start/cron.js"]);

ls.stdout.on("data", async (stdout) => {
  let type = stdout.toString().replace(/(\r\n|\n|\r)/gm, "");
  if (type === "execute") {
    let date = moment();
    let listedWeekMismatch = false;
    let dateAgeMismatch = false;
    const data = await getMenu(date, true, false);
    const listedWeek = moment(data["listed_week"], "WW");

    if (listedWeek.format("WW") !== date.format("WW")) {
      listedWeekMismatch = true;
      date = listedWeek;
    }

    if (date.format("WW") > listedWeek.format("WW")) {
      dateAgeMismatch = true;
      return;
    }

    if (!hasWeekImage(listedWeek)) {
      if (dateAgeMismatch) {
        Logger.warn("Requested menu is older than current week. Ignoring.");
        return;
      }
      if (listedWeekMismatch) {
        Logger.info(
          `Found new menu for week ${listedWeek.format(
            "WW"
          )} but current week is ${date.format("WW")}.`
        );
        Logger.warn("Writing menu as eatery listed week.");
      }
      Logger.info(
        `New menu found for week ${data["listed_week"]}, writing to disk and updating calendar.`
      );
      await getMenu(date, true, true);
      const calendar = await generateCalendar();
      await fs.writeFile("../tmp/eatery-calendar.ical", calendar);
      await Event.emit("new:menu", { data, date });
    } else {
      const menu = await getMenu(date, false, true);
      if (JSON.stringify(menu["menu"]) !== JSON.stringify(data["menu"])) {
        if (dateAgeMismatch) {
          Logger.warn("Requested menu is older than current week. Ignoring.");
          return;
        }
        if (listedWeekMismatch) {
          Logger.info(
            `Found updated menu for week ${listedWeek.format(
              "WW"
            )} but current week is ${date.format("WW")}.`
          );
          Logger.warn("Writing menu as eatery listed week.");
        }
        Logger.warn(
          `Newer menu was found for week ${data["listed_week"]}, replacing old menu and updating calendar.`
        );
        deleteWeek(date);
        await getMenu(date, true, true);
        deleteCalendar();
        const calendar = await generateCalendar();
        await fs.writeFile("../tmp/eatery-calendar.ical", calendar);
        await Event.emit("new:menu", { data, date });
      }
    }
    return;
  }
  Logger.info(`Fetcher scheduler: ${stdout}`);
});

ls.stderr.on("data", (data) => {
  Logger.error(`Fetcher scheduler: ${data}`);
});

ls.on("close", (code) => {
  Logger.warn(`Fetcher scheduler process exited with code ${code}.`);
});
