import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import Fire from '../services/Fire.service'

export const autologin = createActionThunk('AUTOLOGIN', (user: any) => user)
export const saveName = createActionThunk('SAVE_REGISTER_NAME', (name: any) => name)
export const finishLogin = createActionThunk('FINISH_REGISTER', async ({ getState }) => {
  const reducer = getState().authReducer
  const userId = reducer.fireUser.uid
  const saved = reducer.savedName
  const email = reducer.fireUser.email
  const res = await Fire.store().collection('users').doc(userId).get()
  if (!res.exists) {
    const u: any = {
      id: userId,
      email: email,
      first_name: saved ? saved.first_name : '',
      last_name: saved ? saved.last_name : '',
      phone: saved ? saved.phone : '',
    }
    if (saved && saved.facebook && saved.pictureURL) {
      const url = await Fire.uploadFile('images/users/' + userId + '/profile_picture.png', saved.pictureURL)
      u.pictures = [url]
    }
    await Fire.set('users', userId, u)
    return u
  }
  const user = {
    id: res.id,
    ...res.data()
  }
  return user
})
export const updateUser = createActionThunk('UPDATE_USER', async (info: any, { getState }) => {
  const user = getState().authReducer.user
  await Fire.update('users', user.id, info)
  return {
    ...user,
    ...info
  }
})

const initialState = {
  fireUser: null,
  savedName: null,

  user: null,
  updating: false,
};

// Reducer
export const authReducer = handleActions(
  {
    'UPDATE_USER_STARTED': (state: any, action: any) => ({
      ...state,
      updating: true
    }),
    'UPDATE_USER_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      user: action.payload,
      updating: false
    }),
    'UPDATE_USER_FAILED': (state: any, action: any) => ({
      ...state,
      updating: false
    }),

    'FINISH_REGISTER_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      user: action.payload,
    }),

    'AUTOLOGIN_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      fireUser: action.payload,
      user: null,
    }),

    'SAVE_REGISTER_NAME_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      savedName: action.payload,
    }),
  },
  initialState
);
