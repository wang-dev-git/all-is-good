import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import { AsyncStorage } from 'react-native'
import Fire from '../services/Fire.service'
import Cache from '../services/Cache.service'

const saveCart = async (cart: any) => {
  await AsyncStorage.setItem('@cart', JSON.stringify(cart))
  return cart
}

export const loadCart = createActionThunk('LOAD_CART', async () => {
  const res = await AsyncStorage.getItem('@cart')
  if (!res)
    return {}
  return JSON.parse(res) || {}
})

export const isInCart = createActionThunk('IS_IN_CART', (product: any, { getState }) => {
  const cart = getState().cartReducer.cart
  if (!cart || !cart.products)
    return false
  for (const item of cart.products) {
    if (item.id == product.id)
      return true
  }
  return false
})

export const addToCart = createActionThunk('ADD_TO_CART', async (product: any, { getState }) => {
  const cart = getState().cartReducer.cart
  if (!cart || !cart.products)
    return await saveCart({ products: [product] })
  cart.products.push(product)
  return await saveCart(cart)
})

export const removeFromCart = createActionThunk('REMOVE_FROM_CART', async (product: any, { getState }) => {
  const cart = getState().cartReducer.cart
  if (!cart || !cart.products)
    return {}
  for (let i = 0; i < cart.products.length; ++i) {
    const item = cart.products[i]
    if (item.id == product.id) {
      cart.products.splice(i, 1)
      return await saveCart(cart)
    }
  }
  return cart
})

export const clearCart = createActionThunk('CLEAR_CART', async () => {
  return await saveCart({})
})

export const refreshCart = createActionThunk('REFRESH_CART', async ({ getState }) => {
  const cart = getState().cartReducer.cart
  const products: any[] = []
  if (!cart.products)
    return cart
  for (const product of cart.products) {
    const ref = Fire.store().collection('products').doc(product.id)
    const res = await Fire.get(ref)
    if (res) {
      res.pictures = await Cache.save(res.pictures)
      products.push(res)
    }
  }
  cart.products = products
  return await saveCart(cart)
})

const initialState = {
  cart: null,
  toggle: false,
};

// Reducer
export const cartReducer = handleActions(
  {
    'LOAD_CART_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      cart: action.payload,
      toggle: !state.toggle
    }),
    'ADD_TO_CART_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      cart: action.payload,
      toggle: !state.toggle
    }),
    'REMOVE_FROM_CART_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      cart: action.payload,
      toggle: !state.toggle
    }),
    'CLEAR_CART_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      cart: [],
      toggle: !state.toggle
    }),
    'REFRESH_CART_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      cart: action.payload,
      toggle: !state.toggle
    }),
  },
  initialState
);
