<template>
  <div class="multiple-entities-row">
    <div class="multiple-entities-row__first-source">
      <c-entity-row :id="id" :dataEntity="entities[0]" :his="his[0]"></c-entity-row>
    </div>
    <div class="separator"></div>
    <div class="multiple-entities-row__second-source">
      <c-entity-row :id="id" :dataEntity="entities[1]" :his="his[1]" :isFromExternalSource="true"></c-entity-row>
    </div>
  </div>
</template>

<script>
import CEntityRow from '../CEntityRow/CEntityRow.vue'

export default {
  components: { CEntityRow },
  name: 'CMultipleEntitiesRow',
  props: {
    id: {
      type: String
    },
    entities: {
      type: Array,
      default: () => [{}, {}]
    },
    his: {
      type: Array,
      default: () => [null, null]
    }
  }
}
</script>
<style lang="scss">
.multiple-entities-row {
  background-color: white;
  border-radius: 15px;
  .multiple-entities-row__first-source {
    border-radius: 15px;
    background-color: white;
  }
  .multiple-entities-row__second-source {
    border-radius: 15px;
    background-color: white;
  }
  .separator {
    display: flex;
    width: 60%;
    height: 1px;
    background-color: #c0c0c0;
    margin: auto;
    margin-bottom: 20px;
  }
}
</style>
