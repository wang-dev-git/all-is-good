import { showMessage } from "react-native-flash-message";

export default class Flash {

  private static flash(type: any, title: string, message?: string, onPress?: () => void) {
    showMessage({
      message: title,
      description: message,
      type: type,
      onPress: onPress,
    })
  }

  static show(title: string, message?: string, onPress?: () => void) {
    Flash.flash('info', title, message, onPress)
  }

  static error(title: string, message?: string, onPress?: () => void) {
    Flash.flash('danger', title, message, onPress)
  }

}