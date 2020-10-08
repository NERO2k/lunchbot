import { Command } from "discord-akairo";
import { getMenu } from "App/Common/HelperFunctions";
import moment from "moment";
import { embed } from "App/Common/DiscordHelpers";
import Server from "App/Models/Server";
import Logger from "@ioc:Adonis/Core/Logger";
import { Message } from "discord.js";

class LinkCommand extends Command {
  constructor() {
    super("link", {
      aliases: ["link"],
      userPermissions: ["MANAGE_CHANNELS"],
      channel: "guild",
    });
  }

  async exec(message: Message) {
    if (!message.guild) return;
    try {
      const server = await Server.firstOrCreate(
        { channel_id: message.channel.id },
        {
          server_id: message.guild.id,
          channel_id: message.channel.id,
          enabled: false,
        }
      );

      if (!server.enabled) {
        Logger.info(
          `User ${message.author.id} aka ${message.author.username} connected ${message.guild.id} aka ${message.guild.name} to the lunch dispatch.`
        );
        server.enabled = true;
        await server.save();
        await message.reply("Kanalen är nu ansluten :bulb:");

        const menu = await getMenu(moment(), false, true);
        await message.channel.send(embed(menu, moment()));
      } else {
        Logger.info(
          `User ${message.author.id} aka ${message.author.username} disconnected ${message.guild.id} aka ${message.guild.name} to the lunch dispatch.`
        );
        server.enabled = false;
        await server.save();
        message.reply("Kanalen är inte längre ansluten :electric_plug:");
      }
    } catch (error) {
      console.log(error);
      message.channel.send({
        embed: {
          title: ":warning: Något gick fel.",
          description: error.message,
          color: 16776960,
        },
      });
    }
  }
}

export default LinkCommand;
