import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import Fire from '../services/Fire.service'
import AppConfig from '../services/AppConfig.service'
import Tools from '../services/Tools.service'

import french from '../lang/french'
import english from '../lang/english'

const langs = {
  fr: french,
  en: english,
}

export const updateLang = createActionThunk('SET_LANG', (id: any) => {
  return {
    id: id,
    lang: langs[id]
  }
})
export const clearLang = createActionThunk('CLEAR_LANG', () => void 0)

const deviceLanguage = Tools.getDefaultLanguage()
console.log('Device language: ' + deviceLanguage)

const initialState = {
  id: deviceLanguage,
  lang: langs[deviceLanguage],
};

// Reducer
export const langReducer = handleActions(
  {
    'SET_LANG_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      id: action.payload.id,
      lang: action.payload.lang,
    }),
    'CLEAR_LANG_SUCCEEDED': () => (initialState)
  },
  initialState
);
