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
import { getColor } from "../utils/Color";

export default {
  name: "LinesParticles",
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
      if (this.color) {
        canvas.style.backgroundColor = this.color;
      }
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
      emitter.damping = 0.008;
      emitter.rate = new Proton.Rate(this.num ? this.num : 250);
      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(4));
      emitter.addInitialize(
        new Proton.Velocity(
          new Proton.Span(1.5),
          new Proton.Span(0, 360),
          "polar"
        )
      );
      
      const mouseObj = {
        x: width / 2,
        y: height / 2
      };
      const attractionBehaviour = new Proton.Attraction(mouseObj, 0, 0);
      const crossZoneBehaviour = new Proton.CrossZone(
        new Proton.RectZone(0, 0, canvas.width, canvas.height),
        "cross"
      );
      emitter.addBehaviour(new Proton.Color("random"));
      emitter.addBehaviour(attractionBehaviour, crossZoneBehaviour);
      emitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.05));
      emitter.p.x = canvas.width / 2;
      emitter.p.y = canvas.height / 2;
      emitter.emit("once");

      this.proton.addEmitter(emitter);
      this.proton.addRenderer(this.createRenderer(canvas));
      this.crossZoneBehaviour = crossZoneBehaviour;
    },
    createRenderer(canvas) {
      const context = canvas.getContext("2d");
      const renderer = new Proton.CanvasRenderer(canvas);
      renderer.onProtonUpdate = () => {
        context.fillStyle =
          getColor(this.color, 0.02) || "rgba(0, 0, 0, 0.02)";
        context.fillRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleUpdate = function(particle) {
        context.beginPath();
        context.strokeStyle = particle.color;
        context.lineWidth = 1;
        context.moveTo(particle.old.p.x, particle.old.p.y);
        context.lineTo(particle.p.x, particle.p.y);
        context.closePath();
        context.stroke();
      };

      return renderer;
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
