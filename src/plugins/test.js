/* eslint-disable */
const MyCustomPlugin = {
  install(Vue) {
    Vue.prototype.isPluginInstance = true,
    Vue.prototype.printPluginInstance = () => console.log('VUE INSTANCE')
  },
}

export default MyCustomPlugin
