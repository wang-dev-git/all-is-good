import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

export const addCard = createActionThunk('ADD_CARD', async (card: any, { dispatch, getState }) => {
  let cards = getState().cardsReducer.list || []
  cards.push(card)
  return cards
})

export const removeCard = createActionThunk('REMOVE_CARD', async (index: number, { getState }) => {
  const cards = getState().cardsReducer.list
  cards.splice(index, 1)
  return cards
})

export const clearCards = createActionThunk('CLEAR_CARDS', async () => void 0)

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
