import Fire from './Fire.service'

import moment from 'moment'
import 'moment/locale/fr'

export default class Time {

  static moment(val: any) {
    return moment(val)
  }

  static date(input: any) {
    const date = Fire.getDateFor(input)
    return moment(date).format('ddd DD MMM')
  }

  static fullDate(input: any) {
    const date = Fire.getDateFor(input)
    return moment(date).format('dddd, DD MMMM à HH:mm')
  }

  static getPickUpRange(pro, langId) {
    return pro.pick_up_start ? (pro.pick_up_start + ' - ' + pro.pick_up_end) : null
  }

}