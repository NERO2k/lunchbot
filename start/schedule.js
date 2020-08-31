const schedule = require("node-schedule");
require('dotenv').config({path: "../.env"})

console.log("subprocess is now running.")

const time =process.env.DISCORD_SCHEDULE_TIME.split(':')
schedule.scheduleJob(
  { hour: time[0], minute: time[1], dayOfWeek: process.env.DISCORD_SCHEDULE_DAY },
  async () => {
    console.log("dispatch")
  }
)
schedule.scheduleJob("*/5 * * * *",
  async () => {
    console.log("menu")
  }
)
