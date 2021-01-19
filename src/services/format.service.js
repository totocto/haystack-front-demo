const formatService = {
  formatIdEntity: id => {
    return id.split(' ')[0].substring(2)
  },
  formatMarketShare: marketShare => {
    if (!marketShare) return '- %'
    return `${marketShare.toFixed(2).replace('.', ',')} %`
  }
}

export default formatService
