import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

// Actions
export const showModal = createActionThunk('SHOW_MODAL', (data: any) => data)
export const hideModal = createActionThunk('HIDE_MODAL', () => void 0)

// Initial state
const initialState = {
  shown: false,
  component: null,
  onClose: undefined,
};

// Reducer
export const modalReducer = handleActions(
  {
    // Auto sign-in
    'SHOW_MODAL_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      shown: true,
      component: action.payload.component,
      onClose: action.payload.onClose,
    }),

    'HIDE_MODAL_SUCCEEDED': (state: any, action: any) => (
      initialState
    ),
  },
  initialState
);