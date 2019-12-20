import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import Fire from '../services/Fire.service'
import Cache from '../services/Cache.service'

// Fetch orders
const getOrders = async (userId: string, validated: boolean) => {
  const ref = Fire.store().collection('orders')
    .where('userId', '==', userId)
    .where('validated', '==', validated)
    .orderBy('createdAt', 'desc')
    .limit(20)
  return await Fire.list(ref)
}

export const fetchOrders = createActionThunk('FETCH_ORDERS', async ({ getState }) => {
  const userId = getState().authReducer.fireUser.uid
  const pending = await getOrders(userId, false)
  const past = await getOrders(userId, true)

  return {
    past: past,
    pending: pending,
  }
})

export const clearOrders = createActionThunk('CLEAR_PROS', () => void 0)

const initialState = {
  orders: {
    past: [],
    pending: []
  },
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
      orders: action.payload,
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
