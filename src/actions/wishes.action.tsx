import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import { AsyncStorage } from 'react-native'
import Fire from '../services/Fire.service'
import Cache from '../services/Cache.service'

const saveWishes = async (wishes: any[]) => {
  await AsyncStorage.setItem('@wishes', JSON.stringify(wishes))
  return wishes
}

export const loadWishes = createActionThunk('LOAD_WISHES', async () => {
  const res = await AsyncStorage.getItem('@wishes')
  if (!res)
    return []
  return JSON.parse(res) || []
})

export const isInWishes = createActionThunk('IS_IN_WISHES', (product: any, { getState }) => {
  const wishes = getState().wishesReducer.list
  if (!wishes)
    return false
  for (const item of wishes) {
    if (item.id == product.id)
      return true
  }
  return false
})

export const addWish = createActionThunk('ADD_WISH', async (product: any, { getState }) => {
  const wishes = getState().wishesReducer.list
  wishes.push(product)
  Fire.cloud('addFavorite', { productId: product.id })
  return await saveWishes(wishes)
})

export const removeWish = createActionThunk('REMOVE_WISH', async (product: any, { getState }) => {
  const wishes = getState().wishesReducer.list
  if (!wishes)
    return []
  for (let i = 0; i < wishes.length; ++i) {
    const wish = wishes[i]
    if (wish.id == product.id) {
      wishes.splice(i, 1)
      return await saveWishes(wishes)
    }
  }
  return wishes
})

export const clearWishes = createActionThunk('CLEAR_WISHES', async () => {
  return await saveWishes([])
})

export const refreshWishes = createActionThunk('REFRESH_WISHES', async ({ getState }) => {
  const user = getState().authReducer.user
  const wishes = getState().wishesReducer.list
  const newWishes: any[] = []
  for (const wish of wishes) {
    const ref = Fire.store().collection('products').doc(wish.id)
    const res = await Fire.get(ref)
    if (res) {
      res.pictures = await Cache.save(res.pictures)
      newWishes.push(res)
    }
  }
  return await saveWishes(newWishes)
})

const initialState = {
  list: null,
  toggle: false,
};

// Reducer
export const wishesReducer = handleActions(
  {
    'LOAD_WISHES_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      list: action.payload,
      toggle: !state.toggle
    }),
    'ADD_WISH_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      list: action.payload,
      toggle: !state.toggle
    }),
    'REMOVE_WISH_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      list: action.payload,
      toggle: !state.toggle
    }),
    'CLEAR_WISHES_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      list: [],
      toggle: !state.toggle
    }),
    'REFRESH_WISHES_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      list: action.payload,
      toggle: !state.toggle
    }),
  },
  initialState
);
