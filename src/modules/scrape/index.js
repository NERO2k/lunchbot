import axios from 'axios'

export default async => {
  return new Promise((resolve, reject) => {
  	try {
			axios.get("https://eatery.se/kista-nod-lunchmeny/").then(response => {
				const base = response.data.split(`<main id="page-content"`)[1];
				const image = base.split(`<div class="w-image-h">`)[1];
				const cut = image.split(`</div>`)[0];
				const original = cut.split(`data-orig-file="`)[1];
				const end = original.split(`"`)[0];
				resolve(end);
			});
  	} catch(error) {
  		reject(error);
  	}
 	});
}