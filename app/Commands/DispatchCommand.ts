import {Command} from 'discord-akairo'

class DispatchCommand extends Command {
  constructor() {
      super('dispatch', {
          aliases: ['dispatch']
      });
  }

  async exec(message) {
    message.reply('Ran schedule job.')
  }
}

export default DispatchCommand

