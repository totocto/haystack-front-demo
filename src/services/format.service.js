import dataUtils from './data.utils'

const formatService = {
  formatIdEntity: id => {
    return id.split(' ')[0].substring(2)
  },
  formatMarketShare: marketShare => {
    if (!marketShare) return '- %'
    return `${marketShare.toFixed(2).replace('.', ',')} %`
  },
  formatXAxis: histories => {
    return histories.map(history => {
      return dataUtils.formatDate(history.ts).date
    })
  },
  formatYAxis: histories => {
    return histories.map(history => dataUtils.formatVal(history.val))
  }
}

export default formatService
