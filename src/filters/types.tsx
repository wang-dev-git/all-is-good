
const types = [
  {
    key: 'women',
    title: 'Femmes', 
  },
  {
    key: 'men',
    title: 'Hommes', 
  },
  {
    key: 'children',
    title: 'Enfants', 
  },
  {
    key: 'filters',
    title: 'Filtrer'
  }
]

const subtypes = {
  women: [
    {
      key: 'clothes',
      title: 'Vêtements',
      image: require('../images/categories/women/women_clothes.png'),
      color: '#FFA3CC',
    },
    {
      key: 'shoes',
      title: 'Chaussures',
      image: require('../images/categories/men/men_shoes.png'),
      color: '#F9D06D',
    },
    {
      key: 'night',
      title: 'Soirées',
      image: require('../images/categories/women/women_night.png'),
      color: '#A3FFDA',
    },
    {
      key: 'jewelry',
      title: 'Bijoux',
      image: require('../images/categories/women/women_jewelry.png'),
      color: '#A3B6FF',
    },
    {
      key: 'parfums',
      title: 'Parfums',
      image: require('../images/categories/women/women_parfums.png'),
      color: '#F9D06D',
    },
    {
      key: 'bags',
      title: 'Sacs',
      image: require('../images/categories/women/women_bags.png'),
      color: '#F9A76D',
    },
    {
      key: 'makeup',
      title: 'Beauté',
      image: require('../images/categories/women/women_makeup.png'),
      color: '#77DAFF',
    },
    {
      key: 'accessories',
      title: 'Accessoires',
      image: require('../images/categories/women/women_accessories.png'),
      color: '#B183FC',
    },
  ],
  men: [
    {
      key: 'clothes',
      title: 'Vêtements',
      image: require('../images/categories/men/men_clothes.png'),
      color: '#FFA3CC',
    },
    {
      key: 'shoes',
      title: 'Chaussures',
      image: require('../images/categories/men/men_shoes.png'),
      color: '#A3FFDA',
    },
    {
      key: 'night',
      title: 'Soirées',
      image: require('../images/categories/men/men_night.png'),
      color: '#F9A76D',
    },
    {
      key: 'jewelry',
      title: 'Bijoux',
      image: require('../images/categories/men/men_jewelry.png'),
      color: '#A3B6FF',
    },
    {
      key: 'parfums',
      title: 'Parfums',
      image: require('../images/categories/men/men_parfums.png'),
      color: '#F9D06D',
    },
    {
      key: 'bags',
      title: 'Sacs',
      image: require('../images/categories/men/men_bags.png'),
      color: '#F9A76D',
    },
    {
      key: 'accessories',
      title: 'Accessoires',
      image: require('../images/categories/men/men_accessories.png'),
      color: '#B183FC',
    },
  ],
  children: [
    {
      key: 'clothes',
      title: 'Vêtements',
      image: require('../images/categories/children/children_clothes.png'),
      color: '#FFA3CC',
    },
    {
      key: 'shoes',
      title: 'Chaussures',
      image: require('../images/categories/children/children_shoes.png'),
      color: '#F9D06D',
    },
    {
      key: 'night',
      title: 'Soirées',
      image: require('../images/categories/children/children_night.png'),
      color: '#A3FFDA',
    },
    {
      key: 'jewelry',
      title: 'Bijoux',
      image: require('../images/categories/children/children_jewelry.png'),
      color: '#A3B6FF',
    },
    {
      key: 'parfums',
      title: 'Parfums',
      image: require('../images/categories/children/children_parfums.png'),
      color: '#F9D06D',
    },
    {
      key: 'bags',
      title: 'Sacs',
      image: require('../images/categories/children/children_bags.png'),
      color: '#F9A76D',
    },
    {
      key: 'accessories',
      title: 'Accessoires',
      image: require('../images/categories/children/children_accessories.png'),
      color: '#B183FC',
    },
  ],
}

export { types, subtypes }