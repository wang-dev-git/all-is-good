import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';

import Fire from '../services/Fire.service'
import { clearPros } from './pros.action'

export const loadCategories = createActionThunk('LOAD_CATEGORIES', async () => {
  const categoriesRef = Fire.store().collection('categories').where('active', '==', true)
  return await Fire.list(categoriesRef)
})

export const loadSearchable = createActionThunk('LOAD_SEARCHABLE', async () => {
  const prosRef = Fire.store().collection('pros').where('active', '==', true)
  return await Fire.list(prosRef)
})

export const searchByName = createActionThunk('SEARCH_BY_NAME', async (query: string, { getState }) => {
  const searchable = getState().filtersReducer.searchable
  const filtered: any[] = []
  for (const item of searchable) {
    if (item.name.includes(query))
      filtered.push(item)
  }
  return filtered
})

export const saveFilters = createActionThunk('SAVE_FILTERS', async (filters, { dispatch }) => {
  await dispatch(clearPros())
  return filters
})

const initialState = {
  filters: {},
  searchable: [],
  loadingSearchable: [],
  categories: [],
  loadingCategories: [],
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

    'LOAD_SEARCHABLE_STARTED': (state: any, action: any) => ({
      ...state,
      loadingSearchable: true,
    }),
    'LOAD_SEARCHABLE_FAILED': (state: any, action: any) => ({
      ...state,
      loadingSearchable: false,
    }),
    'LOAD_SEARCHABLE_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      searchable: action.payload,
      toggle: !state.toggle,
      loadingSearchable: true,
    }),

    'LOAD_CATEGORIES_STARTED': (state: any, action: any) => ({
      ...state,
      loadingCategories: true,
    }),
    'LOAD_CATEGORIES_FAILED': (state: any, action: any) => ({
      ...state,
      loadingCategories: false,
    }),
    'LOAD_CATEGORIES_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      categories: action.payload,
      loadingCategories: false,
    }),
  },
  initialState
);
