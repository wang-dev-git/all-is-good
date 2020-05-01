const icons = [
  { id: 'fish', img: require('../images/icons/fish.png') },
  { id: 'meat', img: require('../images/icons/meat.png') },
  { id: 'pizza', img: require('../images/icons/pizza.png') },
  { id: 'bakery', img: require('../images/icons/bakery.png') },
  { id: 'bakery2', img: require('../images/icons/bakery2.png') },
  { id: 'beer', img: require('../images/icons/beer.png') },
  { id: 'burgers', img: require('../images/icons/burgers.png') },
  { id: 'cake', img: require('../images/icons/cake.png') },
  { id: 'fruits', img: require('../images/icons/fruits.png') },
]

export const getIcon = (id) => {
  for (const item of icons) {
    if (item.id === id)
      return item.img
  }
  return undefined
}

export default icons