import * as GoogleSignIn from 'expo-google-sign-in'

import AppConfig from './AppConfig.service'

export default class Google {

  static async init() {
    return await GoogleSignIn.initAsync({ clientId: AppConfig.get().googleClientID });
  }

  static async login() {
    await GoogleSignIn.askForPlayServicesAsync();
    const { type, user } = await GoogleSignIn.signInAsync();
    if (type === 'success') {
      return { token: user.auth.idToken, user: user }
    }
    return { token: null, user: null }
  }

  static async logout() {
    return await GoogleSignIn.signOutAsync()
  }
}