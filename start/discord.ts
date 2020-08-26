import Env from "@ioc:Adonis/Core/Env";
import schedule from 'node-schedule'

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
/*
// @ts-ignore
const time = Env.get("DISCORD_SCHEDULE_TIME").split(':')
schedule.scheduleJob(
  { hour: time[0], minute: time[1], dayOfWeek: Env.get("DISCORD_SCHEDULE_DAY") },
  async () => {
    const data = await getMenu(moment(), false)
    await dispatch(lunchBot, data, moment())
  }
).bind(null, null)*/
