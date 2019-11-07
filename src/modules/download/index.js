import path from 'path';
import axios from 'axios';
import fs from 'fs';
import moment from 'moment';

import {log} from '../';

export default async (url, date) => 
{
	const fpath = `tmp/eatery-${date.format('YYYY-WW')}.png`;

  	if (!fs.existsSync(fpath)) {
		const writer = fs.createWriteStream(fpath)

		const response = await axios({
			url,
			method: 'GET',
			responseType: 'stream'
		});

		if (response.status === 200)
		{
			response.data.pipe(writer)
		} else {
			reject('Failed to fetch eatery menu.');
		}

		return new Promise((resolve, reject) => {
			writer.on('finish', resolve)
			writer.on('error', () => {
				log('ERROR', 'Failed to write eatery menu.', '#ff0000');
				reject();
			})
		})
	} else {
		return new Promise((resolve, reject) => {
			resolve();
		})
	}
}