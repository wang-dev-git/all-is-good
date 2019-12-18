import * as Facebook from 'expo-facebook';

import AppConfig from './AppConfig.service'

export default class FacebookService {

  // Login to facebook
  static async login() {
    const {
      type,
      token,
      expires,
    } = await Facebook.logInWithReadPermissionsAsync(AppConfig.facebookId, {
      permissions: ['public_profile', 'email'],
    });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const res = await fetch(`https://graph.facebook.com/me?fields=email,first_name,last_name,picture.width(500).height(500) &access_token=${token}`);
      const user = await res.json()
      return { user, token }
    }
    return { user: null, token}
  }

}