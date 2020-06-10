const icons = [
  { id: 'bread', img: require('../images/icons/bread.png') },
  { id: 'burger', img: require('../images/icons/burger.png') },
  { id: 'cake', img: require('../images/icons/cake.png') },
  { id: 'pizza', img: require('../images/icons/pizza.png') },
  { id: 'chicken', img: require('../images/icons/chicken.png') },
  { id: 'food', img: require('../images/icons/food.png') },
  { id: 'fridge', img: require('../images/icons/fridge.png') },
  { id: 'fries', img: require('../images/icons/fries.png') },
  { id: 'hotdog', img: require('../images/icons/hotdog.png') },
  { id: 'lobster', img: require('../images/icons/lobster.png') },
  { id: 'macaroon', img: require('../images/icons/macaroon.png') },
  { id: 'mini-donut', img: require('../images/icons/mini-donut.png') },
  { id: 'motorcycle', img: require('../images/icons/motorcycle.png') },
  { id: 'pasta', img: require('../images/icons/pasta.png') },
  { id: 'sandwich', img: require('../images/icons/sandwich.png') },
  { id: 'shrimp', img: require('../images/icons/shrimp.png') },
  { id: 'skewer', img: require('../images/icons/skewer.png') },
  { id: 'summer', img: require('../images/icons/summer.png') },
  { id: 'sushi', img: require('../images/icons/sushi.png') },
  { id: 'tacos', img: require('../images/icons/tacos.png') },
  { id: 'toast', img: require('../images/icons/toast.png') },
  { id: 'wrap', img: require('../images/icons/wrap.png') },
]

export const getIcon = (id) => {
  for (const item of icons) {
    if (item.id === id)
      return item.img
  }
  return undefined
}

export default icons