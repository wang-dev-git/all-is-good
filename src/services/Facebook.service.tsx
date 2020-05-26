import * as Facebook from 'expo-facebook';

import AppConfig from './AppConfig.service'

export default class FacebookService {

  // Login to facebook
  static async login() {
    await Facebook.initializeAsync(AppConfig.facebookId, "All is Good")
    const loginRes = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile', 'email'],
    });
    if (loginRes.type === 'success') {
      const token = loginRes.token
      // Get the user's name using Facebook's Graph API
      const res = await fetch(`https://graph.facebook.com/me?fields=email,first_name,last_name,picture.width(500).height(500)&access_token=${token}`);
      const user = await res.json()
      return { user, token: token }
    }
    return { user: null, token: null }
  }

}