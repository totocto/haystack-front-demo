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
        if(entity.id.val === entityId) isEntityFromSource = true
      })
    })
    return isEntityFromSource
  },
  formatEntityName: entity => {
    const id = entity.id.val
    const entityName = id.substring(2).split(' ')
    if(entityName.length === 1) {
      if(entity.dis) return entity.dis.val.substring(2)
      return `@${entityName[0]}`
    }
    entityName.shift()
    return entityName.join(' ')
  },
  idToNameEntity: entitiesfromAllSource => {
    let mapEntityIdToEntityName = {}
    entitiesfromAllSource.map(entities => {
      entities.map(entity => {
        const entityId = formatService.formatIdEntity(entity.id.val)
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
  formatCharts(historic) {
    return historic.map(point => {
      return [dataUtils.formatDate(point.ts),  dataUtils.formatVal(point.val)]
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
  findSimilarObjectsKeyWithSameValues(object1,object2) {
    const similarKeysWithSameValues = []
    Object.keys(object1).map(key => {
      if (object2.hasOwnProperty(key) && object2[key].val === object1[key].val && key !== 'id') {
        similarKeysWithSameValues.push(key)
      }
    })
    return similarKeysWithSameValues
  },
  findSimilarObjectsKeyWithDifferentsValues(object1, object2) {
    const similarKeysWithDifferentsValues = []
    Object.keys(object1).map(key => {
      if (object2.hasOwnProperty(key) && object2[key].val !== object1[key].val) {
        similarKeysWithDifferentsValues.push(key)
      }
    })
    return similarKeysWithDifferentsValues
  },
  addApiSourceInformationToEntity: (entities, apiNumber) => {
    entities.map(entity => {
      Object.keys(entity).map(key => {
        if (typeof entity[key] === 'string') {
          const newEntityKey = { val: entity[key], apiSource: apiNumber}
          entity[key] = newEntityKey
        }
      })
    })
    return entities
  },
  addApiSourceInformation: (entitiesFromAllSource) => {
    entitiesFromAllSource.slice().map((entities, index) => {
      entities.map(entity => {
        Object.keys(entity).map(key => {
          if (typeof entity[key] === 'string') {
            const newEntityKey = { val: entity[key], apiSource: index}
            entity[key] = newEntityKey
          }
        })
      })
    })
    return entitiesFromAllSource
  },
  groupAllEntitiesById: entitiesFromAllSources => {
    let initialEntities = entitiesFromAllSources.slice().shift()
    return entitiesFromAllSources.slice().reduce((acc, entities) => formatService.groupTwoEntitiesById(acc, entities), initialEntities)
  },
  groupTwoEntitiesById: (entitiesFromFirstSource, entitiesFromSecondSource) => {
    const mergeEntities = []
    entitiesFromFirstSource.map(entityFromFirstSource => {
      const idFromSource = formatService.formatIdEntity(entityFromFirstSource.id.val)
      entitiesFromSecondSource.map(entityFromSecondSource => {
        const idFromSecondSource = formatService.formatIdEntity(entityFromSecondSource.id.val)
        if (idFromSource === idFromSecondSource) {
          const keysWithSameValues = formatService.findSimilarObjectsKeyWithSameValues(
            entityFromFirstSource,
            entityFromSecondSource
          )
          keysWithSameValues.map(key => entityFromSecondSource[key] = entityFromFirstSource[key])
          const keysWithDifferentValues = formatService.findSimilarObjectsKeyWithDifferentsValues(
            entityFromFirstSource,
            entityFromSecondSource
          )
          keysWithDifferentValues.map(key => {
            if(key === 'id') {
              entityFromSecondSource[key] = entityFromFirstSource[key]
            }
            else {
              entityFromFirstSource = formatService.renameObjectKey(entityFromFirstSource, key, `${key}_${entityFromFirstSource[key].apiSource}`)
              entityFromSecondSource = formatService.renameObjectKey(entityFromSecondSource, key, `${key}_${entityFromSecondSource[key].apiSource}`)
            }
          })
        mergeEntities.push({ ...entityFromSecondSource, ...entityFromFirstSource })
        entitiesFromSecondSource = entitiesFromSecondSource.slice().filter(entity => formatService.formatIdEntity(entity.id.val) !== idFromSource)
        entitiesFromFirstSource = entitiesFromFirstSource.slice().filter(entity => formatService.formatIdEntity(entity.id.val) !== idFromSource)
        }
      })
    })
    return mergeEntities.concat(entitiesFromFirstSource.concat(entitiesFromSecondSource))
  },
  getLinkBetweenEntities: (entitiesFromAllSource) => {
    const colors = { fromSource: ['#dc143c', '#0000ff', '#00a86b', '#cc5500'], outFromSource: '#c1e1ec' }
    const radiusNode = { fromSource: 10, outFromSource: 5 }
    const entitiesLink = []
    const entitiesNameToEntitiesId = formatService.idToNameEntity(entitiesFromAllSource)
    const colorsLinkOutFromSource = []
    entitiesFromAllSource.map(entities => {
      entities.map( entity => {
        const formatedEntityId = entitiesNameToEntitiesId[formatService.formatIdEntity(entity.id.val)]
        Object.keys(entity).map(key => {
          if(formatService.isRef(entity[key].val) && key !== 'id') {
            const formatedEntityIdLinked = entitiesNameToEntitiesId[formatService.formatIdEntity(entity[key].val)] ? entitiesNameToEntitiesId[formatService.formatIdEntity(entity[key].val)] : formatService.formatIdEntity(entity[key].val)
            const formatedLink = [formatedEntityId, formatedEntityIdLinked]
            if(!formatService.isEntityFromSource(entitiesFromAllSource, entity[key].val)) {
              colorsLinkOutFromSource.push({ id: formatedEntityIdLinked, color: colors.outFromSource, marker: { radius: radiusNode.outFromSource } })
            }
            else colorsLinkOutFromSource.push({ id: formatedEntityIdLinked, color: colors.fromSource, marker: { radius: radiusNode.fromSource } })
              entitiesLink.push(formatedLink)
          }
        })
        colorsLinkOutFromSource.push({ id: formatedEntityId, color: colors.fromSource[entity.id.apiSource - 1], marker: { radius: radiusNode.fromSource } })
      })
    })
    return [entitiesLink, colorsLinkOutFromSource, entitiesNameToEntitiesId]
  }
}

export default formatService
