import Discord from "discord.js";
import { engDayCast } from "../../config/words";
import Env from "@ioc:Adonis/Core/Env";
import User from "App/Models/User";
import Server from "App/Models/Server";
import Logger from "@ioc:Adonis/Core/Logger";

export function embed(data, date) {
  const embed = new Discord.MessageEmbed()
    .setFooter(
      `Lunchbot – Få lunchmenyn direkt i dina DM:s, skriv kommandot <sub.`,
      "https://i.imgur.com/QCfAJ9S.png"
    )
    .setColor(0x7289da);

  embed.setURL(
    `${Env.get("WEBSITE_BASE_URL")}?date=${date.format(
      "WW-YYYY"
    )}&format=WW-YYYY`
  );

  embed.setTitle("EATERY KISTA NOD — MENY VECKA " + data.listed_week);

  Object.keys(data.menu).forEach((value) => {
    const day = engDayCast[value] || value;
    embed.addField(day.toUpperCase(), data.menu[value].join("\n"));
  });

  return embed;
}

export async function dispatch(instance, data, date) {
  const users = await User.all();
  const servers = await Server.all();

  const embedData = embed(data, date);

  for (const user of users) {
    try {
      if (user.channel_id) {
        const userObject = await instance.users.fetch(user.user_id);
        const userChannel = await instance.channels.fetch(user.channel_id);
        const messageCollection = await userChannel.messages.fetch({limit: 1})
        const latestMessage = messageCollection.first()
        if (
          (latestMessage.author.id === instance.user.id) &&
          (latestMessage.embeds.length > 0) &&
          (latestMessage.embeds[0].title.includes("EATERY")) &&
          (latestMessage.embeds[0].title.match(/\d+/g)[0] !== data.actual_week)
        ) {
          await latestMessage.edit(embedData);
          Logger.info(`Edited lunch menu in ${user.user_id}, aka ${userObject.username}`)
        } else {
          await userChannel.send(embedData);
          Logger.info(`Sent lunch menu to ${user.user_id}, aka ${userObject.username}`)
        }
      } else {
        // REMOVE THIS AFTER ONE WEEK
        const userChannel = await instance.users.fetch(user.user_id);
        const message = await userChannel.send(embedData);
        Logger.info(`Sent lunch menu to ${user.user_id}, aka ${userChannel.username} using legacy method.`)
        // @ts-ignore
        await User.updateOrCreate({user_id: user.user_id}, {channel_id: message.channel.id});
        Logger.info(`Migrated ${user.user_id}, aka ${userChannel.username} to new system.`)
        // REMOVE THIS AFTER ONE WEEK
      }
    } catch(error) {
      Logger.error(`Failed to send menu to ${user.user_id}`)
      console.log(error)
    }
  }

  for (const server of servers) {
    try {
      const guildChannel = await instance.channels.fetch(server.channel_id);
      const messageCollection = await guildChannel.messages.fetch({ limit: 1 })
      const latestMessage = messageCollection.first();
      if (
        (latestMessage.author.id === instance.user.id) &&
        (latestMessage.embeds.length > 0) &&
        (latestMessage.embeds[0].title.includes("EATERY")) &&
        (latestMessage.embeds[0].title.match(/\d+/g)[0] !== data.actual_week)
      ) {
        await latestMessage.edit(embedData);
        Logger.info(`Edited lunch menu in ${server.channel_id} in ${server.server_id}, aka ${guildChannel.guild.name}/${guildChannel.name}`)
      } else {
        await guildChannel.send(embedData);
        Logger.info(`Sent lunch menu to ${server.channel_id} in ${server.server_id}, aka ${guildChannel.guild.name}/${guildChannel.name}`)
      }
    } catch(error) {
      Logger.error(`Failed to send lunch menu to ${server.channel_id} in ${server.server_id}.`)
      console.log(error)
    }
  }
}
