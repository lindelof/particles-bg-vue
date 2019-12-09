<template>
  <component
    :is="particles"
    :globalCompositeOperation="globalCompositeOperation"
    :num="getNum()"
    :bg="bg"
    :color="color"
    :canvas="canvas"
    :config="config"
  ></component>
</template>

<script>
import Rand from "./utils/Rand.js";
import BallParticles from "./particles/BallParticles.vue";
import ColorParticles from "./particles/ColorParticles.vue";
import CircleParticles from "./particles/CircleParticles.vue";
import CobwebParticles from "./particles/CobwebParticles.vue";
import ThickParticles from "./particles/ThickParticles.vue";
import CustomParticles from "./particles/CustomParticles.vue";
import LinesParticles from "./particles/LinesParticles.vue";
import PolygonParticles from "./particles/PolygonParticles.vue";
import SquareParticles from "./particles/SquareParticles.vue";
import FountainParticles from "./particles/FountainParticles.vue";
import TadpoleParticles from "./particles/TadpoleParticles.vue";

export default {
  name: "ParticlesBg",
  components: {
    ColorParticles,
    CircleParticles,
    CobwebParticles,
    ThickParticles,
    LinesParticles,
    FountainParticles,
    CustomParticles,
    PolygonParticles,
    SquareParticles,
    TadpoleParticles,
    BallParticles
  },
  props: {
    type: {
      type: String,
      required: false,
      default: "random"
    },
    num: [String, Number],
    bg: Boolean,
    color: String,
    config: Object,
    canvas: Object,
    list: Array,
    globalCompositeOperation: String
  },
  data() {
    return {
      particles: "color-particles"
    };
  },
  methods: {
    getNum() {
      return +this.num;
    },
    getRandom: function() {
      if (!this.random) {
        // Code source from here, thanks author
        // https://github.com/a-jie/Proton/blob/gh-pages/source/src/utils/Rand.js
        this.random = new Rand();
        this.random.set(0.25, "color-particles");
        this.random.set(0.2, "ball-particles");
        this.random.set(0.2, "circle-particles");
        this.random.set(0.2, "cobweb-particles");
        this.random.set(0.2, "thick-particles");
        this.random.set(0.2, "lines-particles");
        this.random.set(0.2, "fountain-particles");
        this.random.set(0.2, "polygon-particles");
        this.random.set(0.2, "square-particles");
        this.random.set(0.2, "tadpole-particles");
      }
      return this.random.getResult();
    },

    getFromList(){
      if(!list) return this.getRandom();
      return list[Math.floor(Math.random() * list.length)];
    },

    setParticles: function() {
      const type = this.type;
      let name = String(type).toLowerCase() || "random";
      if (name.indexOf("-") <= 0) name += "-particles";

      this.particles = name;
      if (this.particles.indexOf("random") === 0) {
        this.particles = this.getRandom();
      }

      if (this.particles.indexOf("list") === 0) {
        this.particles = this.getFromList();
      }
    }
  },
  created() {
    this.setParticles();
  },
  beforeMount() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
