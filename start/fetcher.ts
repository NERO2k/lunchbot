import { spawn } from "child_process";
import { getMenu } from "App/Common/HelperFunctions";
import moment from "moment";
import Logger from "@ioc:Adonis/Core/Logger";
import { deleteWeek, hasWeekImage } from "App/Common/MenuHelpers";
import { deleteCalendar, generateCalendar } from "App/Common/CalendarFunctions";
import * as fs from "fs/promises";
import Event from "@ioc:Adonis/Core/Event";

const ls = spawn("node", ["../start/subprocesses/fetcher.js"]);

ls.stdout.on("data", async (stdout) => {
  let type = stdout.toString().replace(/(\r\n|\n|\r)/gm, "");
  if (type === "menu") {
    const date = moment();
    const data = await getMenu(date, true, false);
    const listedWeek = moment(data["listed_week"], "WW");

    if (listedWeek.week() !== date.week()) {
      Logger.info(
        `Found new menu for week ${listedWeek.week()} but current week is ${date.week()}.`
      );
      return;
    }

    if (!hasWeekImage(listedWeek)) {
      Logger.info(
        `new menu found for week ${data["listed_week"]}, writing to disk and updating calendar.`
      );
      await getMenu(date, true, true);
      const calendar = await generateCalendar();
      await fs.writeFile("../tmp/eatery-calendar.ical", calendar);
      await Event.emit("new:menu", data)
    } else {
      const menu = await getMenu(date, false, true);
      if (JSON.stringify(menu) !== JSON.stringify(data)) {
        Logger.warn(
          `newer menu was found for week ${data["listed_week"]},. replacing old menu and updating calendar.`
        );
        deleteWeek(date);
        await getMenu(date, true, true);
        deleteCalendar();
        const calendar = await generateCalendar();
        await fs.writeFile("../tmp/eatery-calendar.ical", calendar);
        await Event.emit("new:menu", data)
      }
    }
    return;
  }
  Logger.info(`fetcher scheduler: ${stdout}`);
});

ls.stderr.on("data", (data) => {
  Logger.error(`fetcher scheduler: ${data}`);
});

ls.on("close", (code) => {
  Logger.warn(`fetcher scheduler process exited with code ${code}.`);
});
