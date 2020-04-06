<template>
  <canvas
    class="canvas"
    ref="canvasRef"
    v-bind:style="styleObject"
    v-on:mousedown="handleMouseDown"
    v-on:mousemove="handleMouseMove"
  />
</template>

<script>
export default {
  name: "CanvasComp",
  props: {
    canvas: Object,
    bg: Boolean,
    globalCompositeOperation: String
  },
  data: function() {
    return {
      styleObject: {
        width: "100%",
        height: "100%"
      }
    };
  },
  methods: {
    initCanvas: function() {
      const canvas = this.$refs.canvasRef;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;

      if (this.globalCompositeOperation) {
        const context = canvas.getContext("2d");
        context.globalCompositeOperation = this.globalCompositeOperation;
      }

      this.$emit("canvasInited", canvas);
    },
    resize: function() {
      const canvas = this.$refs.canvasRef;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      this.$emit("canvasResize", { width, height });
    },

    handleMouseDown: function(e) {
      this.$emit("canvasMouseDown", e);
    },

    handleMouseMove: function(e) {
      this.$emit("canvasMouseMove", e);
    }
  },
  created() {
    if (this.bg) {
      this.styleObject = Object.assign(this.styleObject, {
        position: "absolute",
        zIndex: -1,
        top: 0,
        left: 0
      });
    }

    if(this.canvas){
      this.styleObject = Object.assign(this.styleObject, this.canvas);
    }
  },
  mounted() {
    this.initCanvas();
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
