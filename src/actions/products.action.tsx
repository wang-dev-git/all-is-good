import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import Fire from '../services/Fire.service'
import Cache from '../services/Cache.service'

// Recently added pros
const getRecentProducts = async () => {
  const ref = Fire.store().collection('pros')
    .orderBy('createdAt', 'desc')
    .limit(8)
  return await Fire.list(ref)
}

// Popular pros
const getPopularProducts = async () => {
  const ref = Fire.store().collection('pros')
    .orderBy('popularity', 'desc')
    .limit(8)
  return await Fire.list(ref)
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
  const popular = await getPopularProducts()
  const recent = await getRecentProducts()

  return {
    byDate: (recent),
    byPopularity: (popular),
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
