import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

// All reducers
import { tabReducer } from './actions/tab.action'
import { filtersReducer } from './actions/filters.action'
import { authReducer } from './actions/auth.action'
import { wishesReducer } from './actions/wishes.action'
import { prosReducer } from './actions/pros.action'
import { modalReducer } from './actions/modal.action'
import { cardsReducer } from './actions/cards.action'
import { loaderReducer } from './actions/loader.action'
import { ordersReducer } from './actions/orders.action'

// Create store by combining reducers
export const store = createStore(combineReducers({
  tabReducer,
  authReducer,
  filtersReducer,
  prosReducer,
  wishesReducer,
  cardsReducer,
  ordersReducer,
  
  modalReducer,
  loaderReducer,
}), applyMiddleware(thunk));
