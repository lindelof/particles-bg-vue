<template>
  <div id="app">
    <div>
      <div>hello world</div>
      <particles-bg type="list" :list="list" :config="config" :canvas="canvasStyle" :bg="true" />
    </div>
  </div>
</template>

<script>
import { ParticlesBg } from "./particles-bg";

export default {
  name: "app",
  components: {
    ParticlesBg
  },
  data() {
    return {
      list:["lines", "circle"],
      config:{},
      canvasStyle:{
        // height:"199px"
      }
    };
  },
  methods: {},
  created() {
    this.config = {
      num: [4, 7],
      rps: 0.1,
      radius: [5, 40],
      life: [1.5, 3],
      v: [2, 3],
      tha: [-40, 40],
      alpha: [0.6, 0],
      scale: [0.1, 0.4],
      position: "all",
      color: ["random", "#ff0000"],
      cross: "dead",
      // emitter: "follow",
      random: 15
    };

    if (Math.random() > 0.50) {
      this.config = Object.assign(this.config, {
        onParticleUpdate: (ctx, particle) => {
          ctx.beginPath();
          ctx.rect(
            particle.p.x,
            particle.p.y,
            particle.radius * 2,
            particle.radius * 2
          );
          ctx.fillStyle = particle.color;
          ctx.fill();
          ctx.closePath();
        }
      });
    }
  }
};
</script>

<style lang="scss">
*,
:after,
:before {
  box-sizing: border-box;
}
html,
body {
  height: 100%;
}
body {
  margin: 0;
  background: #fff;
}
#app {
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
