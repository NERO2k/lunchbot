const discord = require("node-schedule");
require("dotenv").config({ path: "../.env" });

console.log("subprocess is now running.");

const timeout = process.env.NODE_ENV === "development" ? "*/10 * * * * *" : "*/5 * * * *";
discord.scheduleJob(timeout, async () => {
  console.log("execute");
});
