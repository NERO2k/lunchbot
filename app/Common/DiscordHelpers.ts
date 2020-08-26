import Discord from "discord.js";
import {engDayCast} from "../../config/words";
import Env from "@ioc:Adonis/Core/Env";

export function embed(data, date)
{
  const embed = new Discord.MessageEmbed()
    .setFooter(
      `Lunchbot – Få lunchmenyn direkt i dina DM:s, skriv kommandot <sub.`,
      'https://i.imgur.com/QCfAJ9S.png'
    )
    .setColor(0x7289da)

  embed.setURL(`${Env.get("WEBSITE_BASE_URL")}?date=${date.format("WW-YYYY")}&format=WW-YYYY`)

  embed.setTitle("EATERY KISTA NOD — MENY VECKA "+data.listed_week)

  Object.keys(data.menu).forEach((value) => {
    const day = engDayCast[value] || value;
    embed.addField(day.charAt(0).toUpperCase()+day.slice(1), data.menu[value].join("\n"))
  });

  return embed;
}
