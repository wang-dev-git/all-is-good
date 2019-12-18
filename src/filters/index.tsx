import { brands } from './brands'
import { colors } from './colors'
import { shoes } from './shoes'
import { sizes } from './sizes'
import { states } from './states'
import { sortings } from './sortings'
import { types, subtypes } from './types'
import { packSizes } from './packSizes'

const categories: any = [
  {
    title: 'Catégorie',
    key: 'types',
    required: true,
  },
  {
    title: 'Etat',
    key: 'states',
    data: states,
    required: true,
  },
  {
    title: 'Taille du colis',
    key: 'packSizes',
    data: packSizes,
    required: true,
  },
  {
    title: 'Marque',
    key: 'brands',
    data: brands,
    required: true,
  },
  {
    title: 'Taille',
    key: 'sizes',
    data: sizes,
  },
  {
    title: 'Pointure',
    key: 'shoes',
    data: shoes,
  },
  {
    title: 'Couleurs',
    key: 'colors',
    data: colors,
    multi: true,
  },
]

const getPackSizePrice = (key: string) => {
  for (const pack of packSizes) {
    if (pack.key == key)
      return pack.fee
  }
  return 0
}

const getShoesSize = (key?: string) => {
  if (key) {
    for (const shoe of shoes) {
      if (shoe.key == key)
        return shoe.value
    }
  }
  return key || ''
}

const getClothSize = (key?: string) => {
  if (key) {
    for (const size of sizes) {
      if (size.key == key)
        return size.value
    }
  }
  return key || ''
}

const getBrandName = (key?: string) => {
  if (key) {
    for (const brand of brands) {
      if (brand.key == key)
        return brand.value
    }
  }
  return key || ''
}
const getStateName = (key?: string) => {
  if (key) {
    for (const state of states) {
      if (state.key == key)
        return state.value
    }
  }
  return 'Neuf'
}

export {
  getPackSizePrice,
  getBrandName,
  getStateName,
  categories,
  types, subtypes,
  brands, colors, shoes, sizes, states,
  sortings
}
