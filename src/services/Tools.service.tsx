import ngeohash from 'ngeohash'
import { Platform, NativeModules } from 'react-native'

export default class Tools {
  
  // Get geohash for given position-level pair
  static getGeohash(pos: any, level: number) {
    return ngeohash.encode(pos.latitude, pos.longitude, level)
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
    return dist;
  }

  static getRegionZoom(pos) {
    return Math.round(Math.log(360 / pos.longitudeDelta) / Math.LN2)
  }

  static getDefaultLanguage() {
    let locale = 'en'
    if (Platform.OS === 'ios') {
      locale = NativeModules.SettingsManager.settings.AppleLocale // "fr_FR"
      console.log(" ==> Current settings: ", NativeModules.SettingsManager.settings)
      if (locale === undefined) {
        locale = NativeModules.SettingsManager.settings.AppleLanguages[0]
        if (locale == undefined)
          return "en"
      }
    } else {
      locale = NativeModules.I18nManager.localeIdentifier;
    }
    return locale
  }

}