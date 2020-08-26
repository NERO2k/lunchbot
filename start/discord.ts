import Env from "@ioc:Adonis/Core/Env";

const { AkairoClient, CommandHandler } = require('discord-akairo');

class LunchBot extends AkairoClient {
  constructor() {
    super({
      ownerID: '12345678910',
    }, {
      disableEveryone: true
    });
    this.commandHandler = new CommandHandler(this, {
      directory: '../app/Commands/',
      prefix: '!'
    });

    this.commandHandler.loadAll();
  }
}

const lunchBot = new LunchBot();
lunchBot.login(Env.get('DISCORD_BOT_TOKEN'));

lunchBot.once("ready", () => {
  console.log(`Logged in as ${lunchBot.user.tag}!`)

})
