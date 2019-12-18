

export default class Maps {

  static serverURL = 'https://maps.googleapis.com/maps/api'
  static apiKey = 'AIzaSyBR046smIiQUeRbBaErZWkgtdiMFmOlAlc'

  static async request(route: string) {
    const uri = this.serverURL + route + '&key=' + this.apiKey
    try {
      const res = await fetch(uri)
      const json = await res.json()
      return json
    } catch (err) {
      console.log(err)
    }
    return null
  }

  static async getAddresses(input: string) {
    const route = '/place/findplacefromtext/json?inputtype=textquery&fields=name,formatted_address,geometry&input=' + input + '&fields=geometry&language=fr'
    const res = await this.request(route)
    return res.candidates || []
  }

  static async getAddress(lat: number, lng: number) {
    const route = '/geocode/json?latlng=' + lat + ',' + lng
    const res = await this.request(route)
    return res.results || []
  }

  static regionContainingPoints(points: any[]) {
    let minLat, maxLat, minLng, maxLng;

    // init first point
    (point => {
      minLat = point.latitude;
      maxLat = point.latitude;
      minLng = point.longitude;
      maxLng = point.longitude;
    })(points[0]);

    // calculate rect
    points.forEach(point => {
      minLat = Math.min(minLat, point.latitude);
      maxLat = Math.max(maxLat, point.latitude);
      minLng = Math.min(minLng, point.longitude);
      maxLng = Math.max(maxLng, point.longitude);
    });

    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;

    const deltaLat = (maxLat - minLat);
    const deltaLng = (maxLng - minLng);

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: deltaLat + 0.014,
      longitudeDelta: deltaLng + 0.014,
    };
  }

}