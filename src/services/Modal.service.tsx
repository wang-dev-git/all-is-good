import { store } from '../store'

import { showModal, hideModal } from '../actions/modal.action'

type ModalData = {
  local?: boolean;
  component: any;
  onClose?: () => void;
}

// Service
export default class Modal {
  
  static show(key: string, data: ModalData) { 
    store.dispatch(showModal(key, data))
  }

  static hide(key: string) { store.dispatch(hideModal(key)) }
}
