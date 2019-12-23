import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

// Actions
export const showModal = createActionThunk('SHOW_MODAL', (key: string, data: any) => ({key: key, data: data}))
export const hideModal = createActionThunk('HIDE_MODAL', (key: string) => ({key: key}))

// Initial state
const initialState = {
  modals: {},
  toggle: false,
};

// Reducer
export const modalReducer = handleActions(
  {
    // Auto sign-in
    'SHOW_MODAL_SUCCEEDED': (state: any, action: any) => {
      const modals = state.modals
      modals[action.payload.key] = action.payload.data
      modals[action.payload.key].key = action.payload.key
      modals[action.payload.key].shown = true
      return {
        ...state,
        toggle: !state.toggle,
      }
    },

    'HIDE_MODAL_SUCCEEDED': (state: any, action: any) => {
      const modals = state.modals
      modals[action.payload.key].shown = false
      return {
        ...state,
        toggle: !state.toggle,
      }
    },
  },
  initialState
);