import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import Fire from '../services/Fire.service'
import AppConfig from '../services/AppConfig.service'

export const updateLang = createActionThunk('SET_LANG', (user: any) => user)

const initialState = {
  lang: AppConfig.defaultLang,
};

// Reducer
export const langReducer = handleActions(
  {
    'SET_LANG_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      fireUser: action.payload,
      user: null,
    }),
  },
  initialState
);
