import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import { clearPros } from './pros.action'

export const saveFilters = createActionThunk('SAVE_FILTERS', async (filters, { dispatch }) => {
  await dispatch(clearPros())
  return filters
})

const initialState = {
  filters: {
    sorting: 'price',
    search: '',
  },
  toggle: false,
};

// Reducer
export const filtersReducer = handleActions(
  {
    'SAVE_FILTERS_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      filters: action.payload,
      toggle: !state.toggle,
    }),
  },
  initialState
);
