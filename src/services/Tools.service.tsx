import ngeohash from 'ngeohash'
import * as Localization from 'expo-localization';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from "expo-constants";
import { Platform, Linking } from 'react-native'

export default class Tools {
  
  // Get geohash for given position-level pair
  static getGeohash(pos: any, level: number) {
    return ngeohash.encode(pos.latitude, pos.longitude, level)
  }

  // Map distances range (kilometers) to geohash levels
  static getGeohashForDistance(pos: any, distance: number) {
    let level = 5
    if (distance > 100)
      level = 4
    return ngeohash.encode(pos.lat, pos.lng, level)
  }
  
  static getRoundedDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit: 'K' | 'M' | 'N' = 'K') {
    return Number(this.getDistance(lat1, lon1, lat2, lon2, unit)).toFixed(1)
  }

  // Get distance between two points
  static getDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit: 'K' | 'M' | 'N' = 'K') {
    if ((lat1 == lat2) && (lon1 == lon2))
      return 0;
    
    const radlat1 = Math.PI * lat1/180;
    const radlat2 = Math.PI * lat2/180;
    const theta = lon1-lon2;
    const radtheta = Math.PI * theta/180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1)
      dist = 1;
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist; // Rounding because we don't care about meters
  }

  static getRegionZoom(pos) {
    return Math.round(Math.log(360 / pos.longitudeDelta) / Math.LN2)
  }

  static getDefaultLanguage() {
    const locale = Localization.locales[0]
    if (locale === 'fr-FR')
      return 'fr'
    if (locale === 'es-US')
      return 'es'
    return 'en'
  }

  static async showSettings() {
    if (Platform.OS === 'android') {
      try {
        const pkg = Constants.manifest.releaseChannel ? Constants.manifest.android.package : "host.exp.exponent";
        await IntentLauncher.startActivityAsync(IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS, { data: "package:" + pkg });
      } catch (err) {
        console.warn(err)
        alert("Rendez-vous dans les réglages de votre téléphone pour activer les notifications")
      }
    } else {
      const supported = await Linking.canOpenURL('app-settings:')
      if (!supported) {
        alert("Rendez-vous dans les réglages de votre téléphone pour activer les notifications")
      } else {
        Linking.openURL('app-settings:');
      }
    }
  }

}