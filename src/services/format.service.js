/* eslint-disable */
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
  renameObjectKey(object, oldKey, newKey) {
    Object.defineProperty(object, newKey, Object.getOwnPropertyDescriptor(object, oldKey))
    delete object[oldKey]
    return object
  },
  findSimilarObjectsKeyWithDifferentsValues(object1, object2) {
    const similarKeysWithDifferentsValues = []
    Object.keys(object1).map(key => {
      if (object2.hasOwnProperty(key) && object2[key] !== object1[key]) {
        similarKeysWithDifferentsValues.push(key)
      }
    })
    return similarKeysWithDifferentsValues
  },
  groupByIdBis: (entitiesFromFirstSource, entitiesFromSecondSource) => {
    const mergeEntities = []
    entitiesFromFirstSource.map(entityFromFirstSource => {
      const idFromSource = entityFromFirstSource.id
      entitiesFromSecondSource.map(entityFromSecondSource => {
        if (idFromSource === entityFromSecondSource.id) {
          const keysWithDifferentValues = formatService.findSimilarObjectsKeyWithDifferentsValues(
            entityFromFirstSource,
            entityFromSecondSource
          )
          keysWithDifferentValues.map(key => {
            entityFromFirstSource = formatService.renameObjectKey(entityFromFirstSource, key, `${key}_1`)
            entityFromSecondSource = formatService.renameObjectKey(entityFromSecondSource, key, `${key}_2`)
          })
          mergeEntities.push({ ...entityFromFirstSource, ...entityFromSecondSource })
          entitiesFromSecondSource = entitiesFromSecondSource.filter(entity => entity.id !== idFromSource)
          entitiesFromFirstSource = entitiesFromSecondSource.filter(entity => entity.id !== idFromSource)
        }
      })
    })
    return mergeEntities.concat(entitiesFromFirstSource.concat(entitiesFromSecondSource))
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
