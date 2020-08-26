import {Command} from 'discord-akairo'

class MenuCommand extends Command {
    constructor() {
        super('hello', {
            aliases: ['hello']
        });
    }

    exec(message) {
        // Also available: util.reply()
        return message.util.send('Hello!');
    }
}

module.exports = MenuCommand;
