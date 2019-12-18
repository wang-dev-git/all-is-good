const fetch = require('node-fetch');

export default class Chrono {

  static serverURL = 'https://isclothing-relay-api.herokuapp.com/'

  private static async request(url, data: any = null) {
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

  static async getRelays(postal_code: string) {
    const res = await this.request('relay-point-search.php', {
      country_code: 'FR',
      zip: postal_code
    })
    if (res.data && res.data.relay_points)
      return res.data.relay_points
    return []
  }

}