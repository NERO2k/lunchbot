import Env from "@ioc:Adonis/Core/Env";
import {spawn} from 'child_process';

import { AkairoClient, CommandHandler } from 'discord-akairo'
import Logger from "@ioc:Adonis/Core/Logger";
import {getMenu} from "App/Common/HelperFunctions";
import moment from "moment";
import {dispatch} from "App/Common/DiscordHelpers";

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

    try {
      this.commandHandler.loadAll();
    } catch (err) {}
  }
}

const lunchBot = new LunchBot()
// @ts-ignore
lunchBot.login(Env.get('DISCORD_BOT_TOKEN'))

lunchBot.once("ready", () => {
  // @ts-ignore
  Logger.info(`started discord bot as ${lunchBot.user.tag}`)
  // @ts-ignore
  lunchBot.user.setActivity("<lunch | <sub | <help")
});

const ls = spawn('node', ['./schedule.js'])

ls.stdout.on('data', async (stdout) => {
  if (stdout === "dispatch") {
    const data = await getMenu(moment(), false, true)
    await dispatch(lunchBot, data, moment())
    Logger.warn("Dispatcher is now running.")
  } else {
    Logger.info(`scheduler: ${stdout}`)
  }
});

ls.stderr.on('data', (data) => {
  Logger.error(`scheduler: ${data}`)
});

ls.on('close', (code) => {
  Logger.warn(`scheduler process exited with code ${code}.`)
});
