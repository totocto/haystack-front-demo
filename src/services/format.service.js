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
  },
  groupById: (entitiesFromFirstSource, entitiesFromSecondSource) => {
    let groupByIdFromSecondSource = []
    let groupedByIdFromFirstSource = []
    let groupById = []
    if (entitiesFromFirstSource.length !== 0) {
      groupedByIdFromFirstSource = entitiesFromFirstSource.map(entityFromSource => {
        const idFromSource = entityFromSource.id
        // eslint-disable-next-line
        const entityFromExternalSourceWithSameId = entitiesFromSecondSource.map(entityFromExternalSource => {
          if (entityFromExternalSource.id === idFromSource) return entityFromExternalSource
        })[0]
        // eslint-disable-next-line
        entitiesFromSecondSource = entitiesFromSecondSource.filter(entity => entity.id !== idFromSource)
        return {
          id: idFromSource,
          entities: [entityFromSource, entityFromExternalSourceWithSameId || {}]
        }
      })
    }
    if (entitiesFromSecondSource.length !== 0) {
      groupByIdFromSecondSource = entitiesFromSecondSource.map(entity => {
        return { id: entity.id, entities: [{}, entity] }
      })
    }
    groupById = groupedByIdFromFirstSource.concat(groupByIdFromSecondSource)
    return groupById
  }
}

export default formatService
