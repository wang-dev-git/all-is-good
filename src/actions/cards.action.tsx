import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import * as SecureStore from 'expo-secure-store';

const saveCards = async (cards: any[]) => {
  await SecureStore.setItemAsync('credit-cards', JSON.stringify(cards))
  return cards
}

export const loadCards = createActionThunk('LOAD_CARDS', async () => {
  const res = await SecureStore.getItemAsync('credit-cards')
  if (!res)
    return []
  return JSON.parse(res) || []
})

export const addCard = createActionThunk('ADD_CARD', async (card: any, { dispatch, getState }) => {
  let cards = getState().cardsReducer.list
  if (!cards)
    cards = await dispatch(loadCards())
  cards.push(card)
  return await saveCards(cards)
})

export const removeCard = createActionThunk('REMOVE_CARD', async (index: number, { getState }) => {
  const cards = getState().cardsReducer.list
  cards.splice(index, 1)
  return await saveCards(cards)
})

export const clearCards = createActionThunk('CLEAR_CARDS', async () => {
  await SecureStore.deleteItemAsync('credit-cards')
})

const initialState = {
  list: [],
  toggle: false,
};

// Reducer
export const cardsReducer = handleActions(
  {
    'LOAD_CARDS_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      list: action.payload,
      toggle: !state.toggle
    }),
    'ADD_CARD_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      list: action.payload,
      toggle: !state.toggle
    }),
    'REMOVE_CARD_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      list: action.payload,
      toggle: !state.toggle
    }),

    'CLEAR_CARDS_SUCCEEDED': (state: any, action: any) => (initialState),
  },
  initialState
);
