import { store } from '../store'

import { showModal, hideModal } from '../actions/modal.action'

type ModalData = {
  component: any;
  onClose?: () => void;
}

// Service
export default class Modal {
  
  static show(data: ModalData) { 
    store.dispatch(showModal(data))
  }

  static hide() { store.dispatch(hideModal()) }
}