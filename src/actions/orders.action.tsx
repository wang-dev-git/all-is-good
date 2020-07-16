import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import Fire from '../services/Fire.service'
import Cache from '../services/Cache.service'

export const fetchOrders = createActionThunk('FETCH_ORDERS', async ({ getState }) => {
  const userId = getState().authReducer.fireUser.uid
  const ref = Fire.store().collection('orders')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
  return await Fire.list(ref)
})

export const clearOrders = createActionThunk('CLEAR_PROS', () => void 0)

const initialState = {
  list: [],
  loading: false,
};

// Reducer
export const ordersReducer = handleActions(
  {
    'FETCH_ORDERS_STARTED': (state: any, action: any) => ({
      ...state,
      loading: true,
    }),
    'FETCH_ORDERS_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      list: action.payload,
      loading: false,
    }),
    'FETCH_ORDERS_FAILED': (state: any, action: any) => ({
      ...state,
      loading: false,
    }),

    'CLEAR_PROS_SUCCEEDED': (state: any, action: any) => (initialState),
  },
  initialState
);
