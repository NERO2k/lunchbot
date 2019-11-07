import chalk from 'chalk';
import moment from 'moment';
import os from 'os'
import fs from 'fs';

export default async (type, str, col) =>
{	
	col = col || "#606060";
    console.log(chalk.bgHex('#1e86da')(" EateryBot ") + chalk.bgHex(col)(" "+type+" ") + " " + str);

	fs.appendFile(`logs/eatery-bot-${moment().format('YYYY-MM-DD')}.txt`, `${moment().format('HH:mm:ss')} [EateryBot][${type}] ${str}`+os.EOL, function (err) {
	  if (err) throw err;
	});
};