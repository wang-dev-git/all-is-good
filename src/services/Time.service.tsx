import Fire from './Fire.service'

import moment from 'moment'
import 'moment/locale/fr'
import 'moment/locale/es'
import 'moment/locale/pt'
import 'moment/locale/en-gb'

export default class Time {

  static moment(val: any, opts?: any) {
    return moment(val, opts)
  }

  static date(input: any, langId: string) {
    let locale = langId
    // View all locale codes in node_modules/moment/locale directory
    if (langId === 'en')
      locale = 'en-gb'
    else if (langId === 'pt')
      locale = 'pt-br'

    const date = Fire.getDateFor(input)
    return moment(date).locale(locale).format('ddd DD MMM YYYY')
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

  static getOpenRange(pro, langId) {
    const startSeconds = pro.open_start_second || 0
    const dateStart = this.moment(new Date()).startOf('day').seconds(startSeconds)
    const start = this.addAMIfNeeded(dateStart, langId)
    
    const endSeconds = pro.open_end_second || 0
    const dateEnd = this.moment(new Date()).startOf('day').seconds(endSeconds)
    const end = this.addAMIfNeeded(dateEnd, langId)

    if (pro.open_start_second !== undefined) {
      return start + ' - ' + end
    }
    return null
  }
}