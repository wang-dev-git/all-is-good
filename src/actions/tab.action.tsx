import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import AppConfig from '../services/AppConfig.service' 

export const switchTab = createActionThunk('SWITCH_TAB', (tab) => tab)

const initialState = {
  tab: AppConfig.defaultTab
};

// Reducer
export const tabReducer = handleActions(
  {
    'SWITCH_TAB_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      tab: action.payload,
    }),
  },
  initialState
);
