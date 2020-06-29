import { createActionThunk } from 'redux-thunk-actions';
import { handleActions } from 'redux-actions';
import { get } from 'geofirex';

import Fire from '../services/Fire.service'
import Tools from '../services/Tools.service'

export const loadCategories = createActionThunk('LOAD_CATEGORIES', async ({ getState }) => {
  const langId = getState().langReducer.id
  const categoriesRef = Fire.store().collection('categories').where('active', '==', true)
  const categories = await Fire.list(categoriesRef)
  categories.sort((a, b) => {
    const nameA = Tools.getLang(a.names, langId).toLowerCase()
    const nameB = Tools.getLang(b.names, langId).toLowerCase()
    if (nameA < nameB) { return -1; }
    if (nameA > nameB) { return 1; }
    return 0;
  })
  return categories
})

export const loadSearchable = createActionThunk('LOAD_SEARCHABLE', async ({ getState }) => {
  const position = getState().authReducer.position
  if (!position)
    return []
  const user = getState().authReducer.user
  if (!user.distance)
    return []
  const hash = Tools.getGeohashForDistance(position.geometry.location, user.distance)
    
  const center = Fire.geo.point(position.geometry.location.lat, position.geometry.location.lng);
  const langId = getState().langReducer.id
  const userRadius = user.distance || 50
  const radius = langId === 'fr' ? userRadius : Tools.milesToKm(userRadius)
  const field = 'location';
  try {
    const prosRef = Fire.store().collection('pros').where('active', '==', true)
    const query = Fire.geo.query(prosRef).within(center, radius, field);
    const pros = await get(query)
    return pros

  } catch (err) {
    console.log(err)
  }
  return []
})

export const loadMap = createActionThunk('LOAD_MAP', async () => {
  const prosRef = Fire.store().collection('pros').where('active', '==', true)
  const pros = await Fire.list(prosRef)
  return pros.filter((item) => item.lat !== undefined)
})

const initialState = {
  filters: {},
  searchable: [],
  loadingSearchable: [],
  categories: [],
  loadingCategories: [],
  toggle: false,
  mapPros: [],
  loadingMap: false,
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


    'LOAD_MAP_STARTED': (state: any, action: any) => ({
      ...state,
      loadingMap: true,
    }),
    'LOAD_MAP_FAILED': (state: any, action: any) => ({
      ...state,
      loadingMap: false,
    }),
    'LOAD_MAP_SUCCEEDED': (state: any, action: any) => ({
      ...state,
      mapPros: action.payload,
      loadingMap: false,
    }),
  },
  initialState
);
