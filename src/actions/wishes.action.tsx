import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import Fire from '../services/Fire.service'

export const isInWishes = createActionThunk('IS_IN_WISHES', (pro: any, { getState }) => {
  const wishes = getState().wishesReducer.list
  if (!wishes)
    return false
  for (const item of wishes) {
    if (item.id == pro.id)
      return true
  }
  return false
})

export const addWish = createActionThunk('ADD_WISH', async (pro: any, { getState }) => {
  const wishes = getState().wishesReducer.list
  wishes.push(pro)
  //Fire.cloud('addFavorite', { proId: pro.id })
  return wishes
})

export const removeWish = createActionThunk('REMOVE_WISH', async (pro: any, { getState }) => {
  const wishes = getState().wishesReducer.list
  if (!wishes)
    return []
  for (let i = 0; i < wishes.length; ++i) {
    const wish = wishes[i]
    if (wish.id == pro.id) {
      wishes.splice(i, 1)
      return wishes
    }
  }
  return wishes
})

export const clearWishes = createActionThunk('CLEAR_WISHES', async () => {
  return []
})

export const refreshWishes = createActionThunk('REFRESH_WISHES', async ({ getState }) => {
  const user = getState().authReducer.user
  const wishes = getState().wishesReducer.list
  const newWishes: any[] = []
  for (const wish of wishes) {
    const ref = Fire.store().collection('pros').doc(wish.id)
    const res = await Fire.get(ref)
    if (res) {
      //res.pictures = await Cache.save(res.pictures)
      newWishes.push(res)
    }
  }
  return newWishes
})

const initialState = {
  list: [],
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
