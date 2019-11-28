import ParticlesBg from './ParticlesBg'

const components = {
  ParticlesBg
}

const install = function (Vue) {
  if (install.installed) return
  Object.keys(components).forEach(key => {
    Vue.component(components[key].name, components[key])
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

const VueParticlesBg = {
  install,
  ...components
};

export { ParticlesBg };
export default VueParticlesBg;