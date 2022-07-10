
import firebaseApp from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions'
import 'firebase/storage'

import AppConfig from './AppConfig.service'
import * as Crypto from 'expo-crypto';
import * as geofirex from 'geofirex';

if (!firebaseApp.apps || !firebaseApp.apps.length) {
  firebaseApp.initializeApp(AppConfig.get().firebaseOptions);
}

export const firebase = firebaseApp

export default class Fire {

  static geo: any = null

  // Initialize Firebase
  static init() {
    if (!firebase.apps || !firebase.apps.length) {
      // @ts-ignore
      this.geo = geofirex.init(firebase);
    }
  }

  // Retrieve base firestore
  static store() {
    return firebase.firestore()
  }

  // Retrieve base auth
  static auth() {
    return firebase.auth()
  }

  // Is verified
  static isUserVerified() {
    const user = Fire.auth().currentUser
    if (!user)
      return false
    console.log(user.emailVerified)
    return !(user.providerData &&
      user.providerData.length > 0 &&
      user.providerData[0].providerId === 'password' &&
      !user.emailVerified)
  }

  static async confirmedEmail() {
    try {
      const user = Fire.auth().currentUser
      await user.reload()
      const reloaded = Fire.auth().currentUser
      if (reloaded.emailVerified)
        return true
    } catch (err) {
      console.log(err)
    }
    return false
  }

  static async resendMail() {
    const user = Fire.auth().currentUser
    if (!user || this.isUserVerified())
      return false
    await user.sendEmailVerification().catch((err) => console.log(err))
    return true
  }

  // Sign in using apple token
  static async signInApple(token: string) {
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256, nonce);

    const provider = new firebase.auth.OAuthProvider("apple.com");
    const credential = provider.credential({
      idToken: token,
      rawNonce: hashedNonce
    });
    return firebase.auth().signInWithCredential(credential)
  }

  // Sign in using facebook token
  static signInFacebook(token: any) {
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    return firebase.auth().signInWithCredential(credential)
  }

  // Sign in using google token
  static signInGoogle(token: any) {
    const credential = firebase.auth.GoogleAuthProvider.credential(token);
    return firebase.auth().signInWithCredential(credential)
  }

  // Retrieve base storage
  static storage() {
    return firebase.storage()
  }

  // Retrieve base functions
  static async cloud(name: string, data: any = {}) {
    const callable = firebase.functions().httpsCallable(name)
    const res = await callable(data)
    return res.data
  }

  // Upload a file to Storage
  static async uploadFile(location: string, uri: string) {
    // Retrieve Blob
    const res = await fetch(uri)
    const blob = await res.blob()
    // Send it to Firebase Storage
    const store = Fire.storage().ref()
    const ref = store.child(location)
    const uploaded = await ref.put(blob)
    // Retrieve persistent URL
    return await uploaded.ref.getDownloadURL()
  }

  // Shortcuts

  static async get(ref: any) {
    const doc = await ref.get()
    if (doc.exists) {
      return {
        id: doc.id,
        ...doc.data()
      }
    }
    return null
  }

  static async list(ref: any) {
    const snap = await ref.get()
    const items: any[] = []
    snap.forEach((doc: any) => {
      let d = doc.data();
      if (doc.exists) {
        items.push({
          id: doc.id,
          ...doc.data(),
        })
      }
    })
    return items
  }

  static set(collection: string, id: string, data: any) {
    return Fire.store().collection(collection).doc(id).set(data)
  }
  static update(collection: string, id: string, data: any) {
    return Fire.store().collection(collection).doc(id).update(data)
  }

  // Dates

  // Retrieve timestamp for given date (for test purpopses only)
  static getTimeFor(date: Date) {
    return firebase.firestore.Timestamp.fromDate(date)
  }

  // Retrieve date from timestamp
  static getDateFor(timestamp: firebase.firestore.Timestamp) {
    if (timestamp.toDate)
      return timestamp.toDate()
    return new Date()
  }
}
