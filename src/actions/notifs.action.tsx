import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import { Fire } from '../services'

export const fetchNotifs = createActionThunk('FETCH_NOTIFS', async ({ getState }) => {
  const userId = getState().authReducer.fireUser.uid
  const notifsRef = Fire.store().
    collection('users').doc(userId)
    .collection('notifs').orderBy('createdAt', 'desc')
  const notifs = await Fire.list(notifsRef)
  return notifs
})

const initialState = {
  list: null,
  loading: false,
  unread: 0
};

// Reducer
export const notifsReducer = handleActions(
  {
    'FETCH_NOTIFS_STARTED': (state: any, action: any) => ({
      ...state,
      list: [],
      loading: true,
    }),
    'FETCH_NOTIFS_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      list: action.payload,
      loading: false,
    }),
    'FETCH_NOTIFS_FAILED': (state: any, action: any) => ({
      ...state,
      loading: false,
    }),
  },
  initialState
);
