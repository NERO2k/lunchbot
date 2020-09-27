import Env from "@ioc:Adonis/Core/Env";
import { AkairoClient, CommandHandler } from "discord-akairo";
import Logger from "@ioc:Adonis/Core/Logger";
import { dispatch } from "App/Common/DiscordHelpers";
import Event from "@ioc:Adonis/Core/Event";

class LunchBot extends AkairoClient {
  private commandHandler: any;
  constructor() {
    super(
      {
        // @ts-ignore
        ownerID: Env.get("DISCORD_BOT_OWNER"),
      },
      {
        disableEveryone: true,
      }
    );
    this.commandHandler = new CommandHandler(this, {
      directory: "./app/Commands",
      prefix: "<",
    });

    try {
      this.commandHandler.loadAll();
    } catch (err) {}
  }
}

const lunchBot = new LunchBot();
// @ts-ignore
lunchBot.login(Env.get("DISCORD_BOT_TOKEN"));

lunchBot.once("ready", () => {
  // @ts-ignore
  Logger.info(`started discord bot as ${lunchBot.user.tag}`);
  // @ts-ignore
  lunchBot.user.setActivity("<lunch | <sub | <help");
});

Event.on("new:menu", async (msg) => {
  Logger.warn("Dispatcher is now running.");
  await dispatch(lunchBot, msg.data, msg.date);
  Logger.warn("Dispatcher has now finished.");
})
