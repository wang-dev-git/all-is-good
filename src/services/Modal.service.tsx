import { store } from '../store'

import { showModal, hideModal, terminateModal } from '../actions/modal.action'

type ModalData = {
  local?: boolean;
  content: any;
  onClose?: () => void;
}

// Service
export default class Modal {
  
  static show(key: string, data: ModalData) { 
    store.dispatch(showModal(key, data))
  }

  static hide(key: string) { store.dispatch(hideModal(key)) }

  static terminate(key: string) { store.dispatch(terminateModal(key)) }
}
