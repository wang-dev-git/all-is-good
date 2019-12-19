import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import Fire from '../services/Fire.service'
import Cache from '../services/Cache.service'

// Recently added pros
const getRecentPros = async () => {
  const ref = Fire.store().collection('pros')
    .orderBy('createdAt', 'desc')
    .limit(8)
  return await Fire.list(ref)
}

// Popular pros
const getPopularPros = async () => {
  const ref = Fire.store().collection('pros')
    .orderBy('popularity', 'desc')
    .limit(8)
  return await Fire.list(ref)
}

export const fetchHomePros = createActionThunk('FETCH_HOME_PROS', async ({ getState }) => {
  const popular = await getPopularPros()
  const recent = await getRecentPros()

  return {
    byDate: (recent),
    byPopularity: (popular),
  }
})

export const clearPros = createActionThunk('CLEAR_PROS', () => void 0)

const initialState = {
  homePros: null,
  loading: false,
};

// Reducer
export const prosReducer = handleActions(
  {
    'FETCH_HOME_PROS_STARTED': (state: any, action: any) => ({
      ...state,
      homePros: {},
      loading: true,
    }),
    'FETCH_HOME_PROS_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      homePros: action.payload,
      loading: false,
    }),
    'FETCH_HOME_PROS_FAILED': (state: any, action: any) => ({
      ...state,
      loading: false,
    }),

    'CLEAR_PROS_SUCCEEDED': (state: any, action: any) => (initialState),
  },
  initialState
);
