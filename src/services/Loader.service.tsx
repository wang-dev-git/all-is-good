import { store } from '../store'

import { showLoader, hideLoader } from '../actions/loader.action'

// Service
export default class Loader {
  static show(title: string) { store.dispatch(showLoader(title)) }
  static hide() { store.dispatch(hideLoader()) }
}
