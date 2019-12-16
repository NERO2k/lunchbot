function isUpperCase(str) { 
  var isnum = /^\d+$/.test(str);
  if (isnum) return false;
  return str === str.toUpperCase();
}

const blockedWords = ['Lunchen', 'VÄLKOMMEN', 'Nybakat', 'KISTA']
const allowedTitles = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag']

export default async data => {
    let menu = data.split('\n')
    let embedData = []
    let response = {}
    let extras = ''
    let title = null
    let current = null
    let lastWasExtra = false

    for (let i = 0; i < menu.length; i++) {
    if (menu[i] !== ' ' && menu[i] !== '' && menu[i] !== null) {
      if (title !== null) {
        let msgSplit = menu[i].split(' ')
        if (!isUpperCase(msgSplit[0])) {
          if (msgSplit.length === 1) {
            if (msgSplit[0].length >= 2) {
              if (allowedTitles.includes(msgSplit[0])) {
                embedData[menu[i]] = ''
                current = menu[i]
                if (lastWasExtra) extras = `${extras}\n`
                lastWasExtra = false
              } else {
                if (!lastWasExtra) {
                  if (!blockedWords.includes(msgSplit[0]))
                    embedData[current] = `${embedData[current] + menu[i]}\n`
                } else {
                  if (!blockedWords.includes(msgSplit[0])) extras = `${extras + menu[i]}`
                }
                if (lastWasExtra) extras = `${extras}\n`
                lastWasExtra = false
              }
            }
          } else {
            if (lastWasExtra) extras = `${extras}\n`
            lastWasExtra = false
            if (!blockedWords.includes(msgSplit[0]))
              embedData[current] = `${embedData[current] + menu[i]}\n`
          }
        } else {
          if (!blockedWords.includes(msgSplit[0])) extras = `${extras + menu[i]} `
          lastWasExtra = true
        }
      } else {
        if (isUpperCase(menu[i])) {
          title = menu[i]
          response.title = title
        }
      }
    }
  }
  response.data = embedData
  response.extras = extras
  return response
}
