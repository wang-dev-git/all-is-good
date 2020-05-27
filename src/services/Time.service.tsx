import Fire from './Fire.service'

import moment from 'moment'
import 'moment/locale/fr'

export default class Time {

  static moment(val: any) {
    return moment(val)
  }

  static date(input: any) {
    const date = Fire.getDateFor(input)
    return moment(date).format('ddd DD MMM YYYY')
  }

  static fullDate(input: any) {
    const date = Fire.getDateFor(input)
    return moment(date).format('dddd, DD MMMM YYYY à HH:mm')
  }

  static addAMIfNeeded(date, langId) {
    if (langId === 'fr')
      return date.format('HH:mm')
    return date.format('h:mm A')
  }

  static getPickUpRange(pro, langId) {
    const startSeconds = pro.pick_up_start_second || 0
    const dateStart = this.moment(new Date()).startOf('day').seconds(startSeconds)
    const start = this.addAMIfNeeded(dateStart, langId)
    
    const endSeconds = pro.pick_up_end_second || 0
    const dateEnd = this.moment(new Date()).startOf('day').seconds(endSeconds)
    const end = this.addAMIfNeeded(dateEnd, langId)

    if (pro.pick_up_start_second !== undefined) {
      return start + ' - ' + end
    }
    return null
  }

}