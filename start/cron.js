const discord = require("node-schedule");
require("dotenv").config({ path: "../.env" });

process.stdout.write("subprocess is now running.");

const timeout =
  process.env.NODE_ENV === "development" ? "*/10 * * * * *" : "*/5 * * * *";
discord.scheduleJob(timeout, async () => {
  process.stdout.write("execute");
});
