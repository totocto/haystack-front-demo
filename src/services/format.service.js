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
  formatEntityName: entity => {
    const id = entity.id
    const entityName = id.substring(2).split(' ')
    if(entityName.length === 1) {
      if(entity.dis) return entity.dis.substring(2)
      return `@${entityName[0]}`
    }
    entityName.shift()
    return entityName.join(' ')
  },
  formatMarketShare: marketShare => {
    if (!marketShare) return '- %'
    return `${marketShare.toFixed(2).replace('.', ',')} %`
  },
  idToNameEntity: entitiesfromAllSource => {
    let mapEntityIdToEntityName = {}
    entitiesfromAllSource.map(entities => {
      entities.map(entity => {
        const entityId = formatService.formatIdEntity(entity.id)
        const entityName = formatService.formatEntityName(entity)
        mapEntityIdToEntityName[entityId] = entityName
      })
    })
    return mapEntityIdToEntityName
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
    return entitiesFromAllSources.reduce((acc, entities) =>  formatService.groupTwoEntitiesById(acc, entities), initialEntities)
  },
  groupTwoEntitiesById: (entitiesFromFirstSource, entitiesFromSecondSource) => {
    const mergeEntities = []
    entitiesFromFirstSource.map(entityFromFirstSource => {
      const idFromSource = formatService.formatIdEntity(entityFromFirstSource.id)
      entitiesFromSecondSource.map(entityFromSecondSource => {
        const idFromSecondSource = formatService.formatIdEntity(entityFromSecondSource.id)
        if (idFromSource === idFromSecondSource) {
          const keysWithDifferentValues = formatService.findSimilarObjectsKeyWithDifferentsValues(
            entityFromFirstSource,
            entityFromSecondSource
          )
          keysWithDifferentValues.map(key => {
            if(key === 'id') {
              entityFromSecondSource[key] = entityFromFirstSource[key]
            }
            else {
              entityFromFirstSource = formatService.renameObjectKey(entityFromFirstSource, key, `${key}_1`)
              entityFromSecondSource = formatService.renameObjectKey(entityFromSecondSource, key, `${key}_2`)
            }
          })
          mergeEntities.push({ ...entityFromFirstSource, ...entityFromSecondSource })
          entitiesFromSecondSource = entitiesFromSecondSource.filter(entity => formatService.formatIdEntity(entity.id) !== idFromSource)
          entitiesFromFirstSource = entitiesFromFirstSource.filter(entity => formatService.formatIdEntity(entity.id) !== idFromSource)
        }
      })
    })
    return mergeEntities.concat(entitiesFromFirstSource.concat(entitiesFromSecondSource))
  },
  getLinkBetweenEntities: (entitiesFromAllSource) => {
    const colors = { fromSource: '#0d8bb5', outFromSource: '#c1e1ec' }
    const radiusNode = { fromSource: 5, outFromSource: 3 }
    const entitiesLink = []
    const entitiesNameToEntitiesId = formatService.idToNameEntity(entitiesFromAllSource)
    const colorsLinkOutFromSource = []
    entitiesFromAllSource.map(entities => {
      entities.map( entity => {
        const formatedEntityId = entitiesNameToEntitiesId[formatService.formatIdEntity(entity.id)]
        Object.keys(entity).map(key => {
          if(formatService.isRef(entity[key]) && key !== 'id') {
            const formatedEntityIdLinked = entitiesNameToEntitiesId[formatService.formatIdEntity(entity[key])] ? entitiesNameToEntitiesId[formatService.formatIdEntity(entity[key])] : formatService.formatIdEntity(entity[key])
            const formatedLink = [formatedEntityId, formatedEntityIdLinked]
            if(!formatService.isEntityFromSource(entitiesFromAllSource, entity[key])) {
              colorsLinkOutFromSource.push({ id: formatedEntityIdLinked, color: colors.outFromSource, marker: { radius: radiusNode.outFromSource } })
            }
            else colorsLinkOutFromSource.push({ id: formatedEntityIdLinked, color: colors.fromSource, marker: { radius: radiusNode.fromSource } })
              entitiesLink.push(formatedLink)
          }
        })
        colorsLinkOutFromSource.push({ id: formatedEntityId, color: colors.fromSource, marker: { radius: radiusNode.fromSource } })
      })
    })
    return [entitiesLink, colorsLinkOutFromSource, entitiesNameToEntitiesId]
  }
}

export default formatService
