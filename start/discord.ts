import Env from "@ioc:Adonis/Core/Env";

import { AkairoClient, CommandHandler } from 'discord-akairo'
import Logger from "@ioc:Adonis/Core/Logger";

class LunchBot extends AkairoClient {
  private commandHandler: any
  constructor() {
    super({
      // @ts-ignore
      ownerID: Env.get('DISCORD_BOT_OWNER'),
    }, {
      disableEveryone: true
    });
    this.commandHandler = new CommandHandler(this, {
      directory: './app/Commands',
      prefix: '<'
    });

    this.commandHandler.loadAll();
  }
}

const lunchBot = new LunchBot()
// @ts-ignore
lunchBot.login(Env.get('DISCORD_BOT_TOKEN'))

lunchBot.once("ready", () => {
  // @ts-ignore
  Logger.info(`started discord bot as ${lunchBot.user.tag}`)

})
