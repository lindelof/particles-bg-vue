<template>
  <canvas-comp
    :bg="bg"
    :canvas="canvas"
    global-composite-operation="source-over"
    v-on:canvasInited="canvasInited"
    v-on:canvasResize="canvasResize"
    v-on:canvasMouseDown="canvasMouseDown"
  />
</template>

<script>
import CanvasComp from "./CanvasComp.vue";
import Proton from "proton-engine";
import RAFManager from "raf-manager";

const colors = [
  "#529B88",
  "#CDD180",
  "#FFFA32",
  "#FB6255",
  "#FB4A53",
  "#FF4E50",
  "#F9D423"
];

export default {
  name: "ColorParticles",
  components: {
    CanvasComp
  },
  props: {
    canvas: Object,
    bg: Boolean,
    num: Number,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.createProton(canvas);
      RAFManager.add(this.renderProton);
    },
    canvasResize({ width, height }) {
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.proton = new Proton();
      const emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(
        this.num ? new Proton.Span(this.num) : new Proton.Span(5, 8),
        new Proton.Span(0.1, 0.25)
      );

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(20, 200));
      emitter.addInitialize(new Proton.Life(2, 4));
      emitter.addInitialize(
        new Proton.Position(new Proton.RectZone(0, 0, width, height))
      );

      emitter.addBehaviour(
        new Proton.Alpha(0, 1, Infinity, Proton.easeOutCubic)
      );
      emitter.addBehaviour(
        new Proton.Scale(1, 0, Infinity, Proton.easeOutCubic)
      );
      emitter.addBehaviour(new Proton.Color(colors, "random"));

      emitter.emit();
      this.proton.addEmitter(emitter);

      const renderer = new Proton.CanvasRenderer(canvas);
      this.proton.addRenderer(renderer);
    },
    renderProton() {
      this.proton && this.proton.update();
    }
  },
  beforeDestroy() {
    try {
      this.proton.destroy();
      RAFManager.remove(this.renderProton);
    } catch (e) {}
  }
};
</script>
