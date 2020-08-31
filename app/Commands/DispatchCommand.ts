import {Command} from 'discord-akairo'
import {getMenu} from "App/Common/HelperFunctions";
import {dispatch} from "App/Common/DiscordHelpers";
import moment from "moment/";

class DispatchCommand extends Command {
  constructor() {
      super('dispatch', {
          aliases: ['dispatch'],
          ownerOnly: true
      });
  }

  async exec(message) {
    await message.reply('Running schedule job.')
    const data = await getMenu(moment(), true, true);
    await dispatch(message.client, data, moment())
    await message.reply('Ran schedule job.')
  }
}

export default DispatchCommand

