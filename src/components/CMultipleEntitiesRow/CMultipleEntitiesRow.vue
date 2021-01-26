<template>
  <div class="multiple-entities-row">
    <c-entity-row :id="id" :dataEntity="entities[0]" :his="his[0]"></c-entity-row>
    <c-entity-row :id="id" :dataEntity="entities[1]" :his="his[1]" :isFromExternalSource="true"></c-entity-row>
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
}
</style>
