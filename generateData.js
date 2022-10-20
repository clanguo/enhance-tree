const fs = require('fs')

let result = []

function generateId() {
  return Math.random().toString(16).slice(2, 7)
}

for (let m = 0; m < 10; m++) {
  result[m] = {
    i: generateId(),
    t: `${m + 1}`,
    c: []
  }
  for (let j = 0; j < 100; j++) {
    result[m].c[j] = {
      i: generateId(),
      t: `${m + 1}-${j + 1}`,
      c: []
    }
    for (let n = 0; n < 1000; n++) {
      result[m].c[j].c[n] = {
        i: generateId(),
        t: `${m + 1}-${j + 1}-${n + 1}`
      }
    }
  }
}

fs.writeFileSync('./public/data.json', JSON.stringify(result), {
  encoding: 'utf-8'
})
