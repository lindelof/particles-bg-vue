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
    color: String,
    num: Number,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.createProton(canvas);
      RAFManager.add(this.renderProton);
    },
    canvasResize({ width, height }) {
      this.crossZoneBehaviour.zone.width = width;
      this.crossZoneBehaviour.zone.height = height;
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.proton = new Proton();

      const emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(this.num || 20);
      emitter.damping = 0.008;

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(30, 600));
      emitter.addInitialize(
        new Proton.Velocity(
          new Proton.Span(0.5),
          new Proton.Span(0, 360),
          "polar"
        )
      );
      emitter.addInitialize(
        new Proton.Position(
          new Proton.RectZone(0, 0, canvas.width, canvas.height)
        )
      );
      const crossZoneBehaviour = new Proton.CrossZone(
        new Proton.RectZone(0, 0, canvas.width, canvas.height),
        "cross"
      );
      emitter.addBehaviour(crossZoneBehaviour);
      emitter.addBehaviour(new Proton.Alpha(Proton.getSpan(0.35, 0.55)));
      emitter.addBehaviour(new Proton.Color(this.getColor()));
      emitter.addBehaviour(new Proton.RandomDrift(50, 50, 0.5));
      emitter.emit("once");
      this.proton.addEmitter(emitter);

      const renderer = new Proton.CanvasRenderer(canvas);
      this.proton.addRenderer(renderer);
      this.crossZoneBehaviour = crossZoneBehaviour;
    },
    getColor() {
      let c = colors;
      if (this.color) {
        if (Array.isArray(this.color)) {
          c = this.color;
        } else {
          c = [this.color];
        }
      }

      return c;
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
