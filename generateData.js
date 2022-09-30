const fs = require('fs')

let result = []

function generateId() {
  return Math.random().toString(16).slice(2)
}

for (let i = 0; i < 10; i++) {
  result[i] = {
    id: generateId(),
    content: `选项${i + 1}`,
    children: []
  }
  for (let j = 0; j < 100; j++) {
    result[i].children[j] = {
      id: generateId(),
      content: `选项${i + 1}-${j + 1}`,
      children: []
    }
    for (let m = 0; m < 1000; m++) {
      result[i].children[j].children[m] = {
        id: generateId(),
        content: `选项${i + 1}-${j + 1}-${m + 1}`
      }
    }
  }
}

fs.writeFileSync('./src/data.json', JSON.stringify(result), {
  encoding: 'utf-8'
})
