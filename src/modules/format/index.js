function isUpperCase(str) {
  var isnum = /^\d+$/.test(str);
  if (isnum) return false;
  return str === str.toUpperCase();
}

const blockedWords = ['Lunchen', 'VÄLKOMMEN', 'Nybakat', 'KISTA', 'TILL', 'Trevlig']
const allowedTitles = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag']

export default async data => {
    let menu = data.split('\n')
    let embedData = []
    let response = {}
    let title = null
    let current = null

    for (let i = 0; i < menu.length; i++) {
    if (menu[i] !== ' ' && menu[i] !== '' && menu[i] !== null) {
      if (title !== null) {
        let msgSplit = menu[i].split(' ')
        if (msgSplit.length === 1) {
          if (msgSplit[0].length >= 3) {
            if (allowedTitles.includes(msgSplit[0])) {
              embedData[menu[i]] = ''
              current = menu[i]
            } else {
              if (!blockedWords.includes(msgSplit[0]))
                embedData[current] = `${embedData[current] + menu[i]}\n`
            }
          }
        } else {
          if (!blockedWords.includes(msgSplit[0]))
            embedData[current] = `${embedData[current] + menu[i]}\n`
        }
      } else {
        if (isUpperCase(menu[i])) {
          title = menu[i]
          response.title = title
          response.week = title.match(/\d+/g);
        }
      }
    }
  }
  response.data = embedData
  return response
}
