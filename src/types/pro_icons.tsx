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
  { id: 'fruits', img: require('../images/icons/fruits.png') },  
  { id: 'fish', img: require('../images/icons/fish.png') },  
  { id: 'milk', img: require('../images/icons/milk.png') },  
  { id: 'meat', img: require('../images/icons/meat.png') }, 
  { id: 'coffee', img: require('../images/icons/coffee.png') }, 
  { id: 'harvest', img: require('../images/icons/harvest.png') }, 
  { id: 'milkshake', img: require('../images/icons/milkshake.png') }, 
  { id: 'drink', img: require('../images/icons/drink.png') },
  { id: 'vegetables', img: require('../images/icons/vegetables.png') },
  { id: 'buffet', img: require('../images/icons/buffet.png') },
  { id: 'hot-dog', img: require('../images/icons/hot-dog.png') },
  { id: 'doughnut', img: require('../images/icons/doughnut.png') },
  { id: 'food-and-restaurant', img: require('../images/icons/food-and-restaurant.png') },
  { id: 'pie', img: require('../images/icons/pie.png') },
  { id: 'cookies', img: require('../images/icons/cookies.png') },
  { id: 'muffin', img: require('../images/icons/muffin.png') },
  { id: 'cheese', img: require('../images/icons/cheese.png') },
  { id: 'chicken-leg', img: require('../images/icons/chicken-leg.png') },
]

export const getIcon = (id) => {
  for (const item of icons) {
    if (item.id === id)
      return item.img
  }
  return undefined
}

export default icons