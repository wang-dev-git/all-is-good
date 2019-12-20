import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

// Actions
export const showLoader = createActionThunk('SHOW_LOADER', (title: string) => title)
export const hideLoader = createActionThunk('HIDE_LOADER', () => void 0)

// Initial state
const initialState = {
  shown: false,
  title: '',
};

// Reducer
export const loaderReducer = handleActions(
  {
    'SHOW_LOADER_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      shown: true,
      title: action.payload,
    }),

    'HIDE_LOADER_SUCCEEDED': (state: any, action: any) => (
      initialState
    ),
  },
  initialState
);