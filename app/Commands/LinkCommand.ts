import {Command} from 'discord-akairo'
import {getMenu} from "App/Common/HelperFunctions";
import moment from "moment";
import {embed} from "App/Common/DiscordHelpers";
import Server from "App/Models/Server";

class LinkCommand extends Command {
  constructor() {
      super('link', {
          aliases: ['link'],
          userPermissions: ['MANAGE_CHANNELS'],
          channel: 'guild'
      });
  }

  async exec(message) {
    const server = await Server.firstOrCreate({channel_id: message.channel.id}, {server_id: message.guild.id, channel_id: message.channel.id, enabled: false})

    if (!server.enabled) {
      server.enabled = true;
      await server.save()
      await message.reply('Kanalen är nu ansluten :bulb:')

      const menu = await getMenu(moment(), false, false)
      await message.channel.send(embed(menu, moment()));
    } else {
      server.enabled = false;
      await server.save()
      message.reply('Kanalen är inte längre ansluten :electric_plug:')
    }
  }
}

export default LinkCommand

