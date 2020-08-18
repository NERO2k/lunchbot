import axios from 'axios'

export default async =>
  new Promise((resolve, reject) => {
    try {
      axios.get('https://eatery.se/kista-nod-lunchmeny').then(({ data }) => {
        const end = "https://i2.wp.com/"+data.split("https://i2.wp.com/")[1].split('"')[0];
        resolve(end)
      })
    } catch (error) {
      reject(error)
    }
  })
