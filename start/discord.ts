import Env from "@ioc:Adonis/Core/Env";

import { AkairoClient, CommandHandler } from 'discord-akairo'

class LunchBot extends AkairoClient {
  constructor() {
    super({
      ownerID: Env.get('DISCORD_BOT_OWNER'),
    }, {
      disableEveryone: true
    });
    this.commandHandler = new CommandHandler(this, {
      directory: '../app/Commands/',
      prefix: '<'
    });

    this.commandHandler.loadAll();
  }
}

const lunchBot = new LunchBot()
lunchBot.login(Env.get('DISCORD_BOT_TOKEN'))

lunchBot.once("ready", () => {
  console.log(`Logged in as ${lunchBot.user.tag}!`)

})
