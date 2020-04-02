import ExpoFileSystemStorage from "redux-persist-expo-filesystem"

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { persistStore, persistCombineReducers } from "redux-persist";
import thunk from 'redux-thunk';

// All reducers
import { langReducer } from './actions/lang.action'
import { tabReducer } from './actions/tab.action'
import { filtersReducer } from './actions/filters.action'
import { authReducer } from './actions/auth.action'
import { wishesReducer } from './actions/wishes.action'
import { prosReducer } from './actions/pros.action'
import { modalReducer } from './actions/modal.action'
import { cardsReducer } from './actions/cards.action'
import { loaderReducer } from './actions/loader.action'
import { ordersReducer } from './actions/orders.action'

// Secure storage
const config = {
  key: "root",
  storage: ExpoFileSystemStorage,
  blacklist: ['tabReducer']
};

// Create store by combining reducers
const reducers = persistCombineReducers(config, {
  tabReducer,
  authReducer,
  filtersReducer,
  prosReducer,
  wishesReducer,
  cardsReducer,
  ordersReducer,
  langReducer,
  
  modalReducer,
  loaderReducer,
})


const store = createStore(reducers, applyMiddleware(thunk))
const persistor = persistStore(store)
export { store, persistor }