import Fire from './Fire.service'
import AppConfig from './AppConfig.service'

const fetch = require('node-fetch');

export default class Expert {

  static serverURL = AppConfig.get().expertAPI

  private static async request(url, data: any = null, method = 'GET') {
    const uri = this.serverURL + url
    const res = await fetch(uri, {
      method: !data ? 'GET' : 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return await res.json()
  }

  static async getBrands() {
    const res = await this.request('/list-brands.php', {})
    if (res.brands)
      return res.brands
    return []
  }

}
