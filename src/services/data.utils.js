import { formatToTimeZone } from 'date-fns-timezone'

const dataUtils = {
  formatDate: dateString => {
    const date = new Date(dateString.substring(2).split(' ')[0])
    return {
      date: formatToTimeZone(date, 'MM/YYYY', { timeZone: 'Europe/Paris' })
    }
  },
  formatVal: valueString => {
    return Number(valueString.substring(2))
  }
}

export default dataUtils
