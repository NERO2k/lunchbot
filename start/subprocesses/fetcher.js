const discord = require("node-schedule");
require("dotenv").config({ path: "../.env" });

console.log("subprocess is now running.");

discord.scheduleJob("*/5 * * * *", async () => {
  console.log("menu");
});
