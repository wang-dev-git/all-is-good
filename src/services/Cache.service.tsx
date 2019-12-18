import { CacheManager } from 'react-native-expo-image-cache'

export default class Cache {

  static async clear() {
    return await CacheManager.clearCache()
  }

  static async load(pic: string) {
    return await CacheManager.get(pic, {}).getPath()
  }

  static async save(pictures: string[]) {
    if (pictures && pictures.length) {
      const cachedPics: string[] = []
      for (const pic of pictures) {
        const path = await this.load(pic)
        cachedPics.push(path)
      }
      return cachedPics
    }
    return []
  }

}