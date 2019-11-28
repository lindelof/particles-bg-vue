// rollup.config.js
import vue from 'rollup-plugin-vue'
export default {
  entry: 'src/particles-bg/index.js',
  format: 'cjs', // 'cjs'
  dest: 'particles-bg/bundle.js', // equivalent to --output
  moduleName: 'VueParticles',
  plugins: [
    vue({ /* configuration options. */ })
  ]
}
