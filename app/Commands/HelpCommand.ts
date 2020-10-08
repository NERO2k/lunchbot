import { Command } from "discord-akairo";
import Logger from "@ioc:Adonis/Core/Logger";
import { Message } from "discord.js";

class HelpCommand extends Command {
  constructor() {
    super("help", {
      aliases: ["help", "hjälp"],
    });
  }

  async exec(message: Message) {
    Logger.info(
      `User ${message.author.id} aka ${message.author.username} asked for the help menu.`
    );
    message.channel.send({
      embed: {
        title: "Lunchbot",
        color: 7506394,
        fields: [
          {
            name: "Lunchmenyn",
            value:
              "Du kan använda kommandot `<lunch {datum} {datum format}` för att skriva ut lunchmenyn i chatten du skriver i.",
          },
          {
            name: "Prenumerera",
            value:
              "Kommandot `<sub` prenumererar ditt konto till att ta emot lunchmenyn direkt via dina direktmeddelanden varje måndag. Du kan också avprenumerera genom att använda samma kommando igen.",
          },
          {
            name: "Länkning",
            value:
              "Som serverägare har du tillgång till kommandot `<link`, detta kommando används för att aktivera/inaktivera lunchbot en kanal på din server. Skriv kommandot i den kanal du vill ta emot meddelanden i.",
          },
        ],
      },
    });
  }
}

export default HelpCommand;
