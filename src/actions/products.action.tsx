import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import Fire from '../services/Fire.service'
import Cache from '../services/Cache.service'

// Recently added products
const getRecentProducts = async () => {
  const ref = Fire.store().collection('products')
    .where('available', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(8)
  return await Fire.list(ref)
}

// Luxurious products
const getExpensiveProducts = async () => {
  const ref = Fire.store().collection('products')
    .where('available', '==', true)
    .orderBy('price', 'desc')
    .limit(8)
  return await Fire.list(ref)
}

// Boosted products
const getBoostedProducts = async () => {
  const now = new Date()
  const ref = Fire.store().collection('products')
    .where('available', '==', true)
    .where('boostedUntil', '>=', now)
    .orderBy('boostedUntil', 'desc')
    .limit(8)
  return await Fire.list(ref)
}

// Popular products
const getPopularProducts = async () => {
  const ref = Fire.store().collection('products')
    .where('available', '==', true)
    .orderBy('popularity', 'desc')
    .limit(8)
  return await Fire.list(ref)
}

// Shops
const getShops = async () => {
  const ref = Fire.store().collection('users')
    .where('hasShop', '==', true)
    .where('validated', '==', true)
    .orderBy('sells', 'desc')
    .limit(8)
  return await Fire.list(ref)
}

const shopsWithCachedImages = async (entities: any) => {
  for (let i = 0; i < entities.length; ++i) {
    const entity = entities[i]
    if (entity.logo) {
      const logos = await Cache.save([entity.logo])
      entities[i].logo = logos[0]
    }
    if (entity.background) {
      const backgrounds = await Cache.save([entity.background])
      entities[i].background = backgrounds[0]
    }
  }
  return entities
}

const withCachedImages = async (entities: any) => {
  for (let i = 0; i < entities.length; ++i) {
    const entity = entities[i]
    entities[i].pictures = await Cache.save(entity.pictures)
  }
  return entities
}

export const fetchProducts = createActionThunk('FETCH_PRODUCTS', async ({ getState }) => {
  const filters = getState().filtersReducer.filters
  //alert('Search: ' + JSON.stringify(filters))
  const products = await Fire.cloud('searchProducts', {
    filters: filters
  })
  return await (products)
})

export const fetchHomeProducts = createActionThunk('FETCH_HOME_PRODUCTS', async ({ getState }) => {
  const expensive = await getExpensiveProducts()
  const shops = await getShops()
  const popular = await getPopularProducts()
  const recent = await getRecentProducts()

  return {
    shops: await (shops),
    byDate: await (recent),
    byPopularity: await (popular),
    byPrice: await (expensive),
  }
})

export const clearProducts = createActionThunk('CLEAR_PRODUCTS', () => void 0)

const initialState = {
  homeProducts: null,
  list: null,
  loading: false,
};

// Reducer
export const productsReducer = handleActions(
  {
    'FETCH_HOME_PRODUCTS_STARTED': (state: any, action: any) => ({
      ...state,
      homeProducts: {},
      loading: true,
    }),
    'FETCH_HOME_PRODUCTS_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      homeProducts: action.payload,
      loading: false,
    }),
    'FETCH_HOME_PRODUCTS_FAILED': (state: any, action: any) => ({
      ...state,
      loading: false,
    }),

    'FETCH_PRODUCTS_STARTED': (state: any, action: any) => ({
      ...state,
      list: [],
      loading: true,
    }),
    'FETCH_PRODUCTS_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      list: action.payload,
      loading: false,
    }),
    'FETCH_PRODUCTS_FAILED': (state: any, action: any) => ({
      ...state,
      loading: false,
    }),

    'CLEAR_PRODUCTS_SUCCEEDED': (state: any, action: any) => (initialState),
  },
  initialState
);
