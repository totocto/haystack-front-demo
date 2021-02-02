/* eslint-disable */
import dataUtils from './data.utils'

const formatService = {
  formatIdEntity: id => {
    return id.split(' ')[0].substring(2)
  },
  isRef: value => {
    return value.substring(0,2) === 'r:'
  },
  isEntityFromSource: (entitiesFromAllSource, entityId) => {
    let isEntityFromSource = false
    entitiesFromAllSource.map(entities => {
      entities.map(entity => {
        if(entity.id === entityId) isEntityFromSource = true
      })
    })
    return isEntityFromSource
  },
  formatEntityName: id => {
    const entityName = id.substring(2).split(' ')
    entityName.shift()
    return entityName.join(' ')
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
  groupAllEntitiesById: entitiesFromAllSources => {
    const initialEntities = entitiesFromAllSources.shift()
    return entitiesFromAllSources.reduce((acc, entities) => formatService.groupTwoEntitiesById(acc, entities), initialEntities)
  },
  groupTwoEntitiesById: (entitiesFromFirstSource, entitiesFromSecondSource) => {
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
  getLinkBetweenEntities: (entitiesFromAllSource) => {
    const entitiesLink = []
    const entitiesNameToEntitiesId = {}
    const colorsLinkOutFromSource = []
    entitiesFromAllSource.map(entities => {
      entities.map( entity => {
        Object.keys(entity).map(key => {
          if(formatService.isRef(entity[key]) && key !== 'id') {
            const formatedEntityName = formatService.formatEntityName(entity[key])
            const formatedEntityId = formatService.formatIdEntity(entity[key])
            const formatedLink = [formatService.formatEntityName(entity.id), formatedEntityName]
            if(!formatService.isEntityFromSource(entitiesFromAllSource, entity[key])) {
              colorsLinkOutFromSource.push({ id: formatedEntityName, color: '#ff0000' })
            }
              entitiesLink.push(formatedLink)
              entitiesNameToEntitiesId[formatedEntityName] = formatedEntityId
          }
        })
      })
    })
    return [entitiesLink, colorsLinkOutFromSource, entitiesNameToEntitiesId]
  }
}

export default formatService
