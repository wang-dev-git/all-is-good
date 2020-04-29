const FISH = require('../images/icons/fish.png')
const MEAT = require('../images/icons/fish.png')

const icons = [
  { id: 'fish', img: FISH },
  { id: 'meat', img: MEAT }
]

export const getIcon = (id) => {
  for (const item of icons) {
    if (item.id === id)
      return item.img
  }
  return undefined
}

export default icons