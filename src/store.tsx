import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

// All reducers
import { tabReducer } from './actions/tab.action'
import { filtersReducer } from './actions/filters.action'
import { authReducer } from './actions/auth.action'
import { cartReducer } from './actions/cart.action'
import { wishesReducer } from './actions/wishes.action'
import { productsReducer } from './actions/products.action'
import { notifsReducer } from './actions/notifs.action'
import { cardsReducer } from './actions/cards.action'

// Create store by combining reducers
export const store = createStore(combineReducers({
  tabReducer,
  authReducer,
  filtersReducer,
  productsReducer,
  notifsReducer,
  cartReducer,
  wishesReducer,
  cardsReducer,
}), applyMiddleware(thunk));
