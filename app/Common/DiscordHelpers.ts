import Discord from "discord.js";
import { engDayCast } from "../../config/words";
import Env from "@ioc:Adonis/Core/Env";
import User from "App/Models/User";
import Server from "App/Models/Server";

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

export async function dispatch(instace, data, date) {
  const users = await User.all();
  const servers = await Server.all();

  const embedData = embed(data, date);

  for (const user of users) {
    let userChannel = await instace.users.fetch(user.user_id);
    userChannel.send(embedData);
  }

  for (const server of servers) {
    let guildChannel = await instace.channels.fetch(server.channel_id);
    guildChannel.send(embedData);
  }
}
