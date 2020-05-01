import * as GoogleSignIn from 'expo-google-sign-in'

export default class Google {

  static iosClientId = '629888312461-halueuaic691dmpbj7rgmf1a2l5a0cv6.apps.googleusercontent.com'

  static async init() {
    return await GoogleSignIn.initAsync({ clientId: this.iosClientId });
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