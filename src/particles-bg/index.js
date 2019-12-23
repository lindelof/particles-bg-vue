import ParticlesBg from "./ParticlesBg";

const components = {
  ParticlesBg: ParticlesBg
};

const install = function(Vue) {
  if (install.installed) return;

  for (let key in components) {
    Vue.component(components[key].name, components[key]);
  }
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

const VueParticlesBg = {
  install,
  ...components
};

export { ParticlesBg };
export default VueParticlesBg;
