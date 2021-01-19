<template>
  <div>
    Hello World
    <main>
      <router-view class="router-view" />
    </main>
  </div>
</template>

<script>
export default {
  name: 'VMainLayout',
  computed: {
    haystackInformation() {
      return this.$store.getters.haystackInformation
    }
  },
  async beforeMount() {
    await this.$store.dispatch('init')
  }
}
</script>

<style lang="scss"></style>
