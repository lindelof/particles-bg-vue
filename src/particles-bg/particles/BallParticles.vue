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
  name: "BallParticles",
  components: {
    CanvasComp
  },
  props: {
    canvas: Object,
    bg: Boolean,
    num: Number,
    color: String,
    config: {}
  },
  methods: {
    canvasInited(canvas) {
      this.createProton(canvas);
      this.createMiniEmitter(canvas);
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

      const context = canvas.getContext("2d");
      const emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(
        this.num ? new Proton.Span(this.num) : new Proton.Span(4, 9),
        new Proton.Span(0.8, 1.3)
      );

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(1, 50));
      emitter.addInitialize(new Proton.Life(5, 6));
      emitter.addInitialize(
        new Proton.Velocity(
          new Proton.Span(5, 8),
          new Proton.Span(30, 70),
          "polar"
        )
      );

      emitter.addBehaviour(new Proton.Alpha(1, 0));
      emitter.addBehaviour(
        new Proton.Color([
          "#36aaf3",
          "#fd769c",
          "#94ff22",
          "#ffa545",
          "#ffffff"
        ])
      );
      emitter.addBehaviour(new Proton.Scale(0.7, 1));
      emitter.addBehaviour(new Proton.Gravity(3));
      emitter.addBehaviour(new Proton.Collision(emitter));
      emitter.addBehaviour(this.customDeadBehaviour(canvas));
      const crossZoneBehaviour = new Proton.CrossZone(
        new Proton.RectZone(0, 0, canvas.width, canvas.height),
        "bound"
      );
      emitter.addBehaviour(crossZoneBehaviour);

      emitter.p.x = Math.min(500, Math.max(canvas.width / 2 - 400, 50));
      emitter.p.y = canvas.height / 2 + 50;
      emitter.emit();
      this.proton.addEmitter(emitter);

      const renderer = new Proton.CanvasRenderer(canvas);
      renderer.onProtonUpdate = () => {
        context.fillStyle =
          getColor(this.color, 0.2) || "rgba(255, 255, 255, 0.2)";
        context.fillRect(0, 0, canvas.width, canvas.height);
      };
      this.proton.addRenderer(renderer);

      this.crossZoneBehaviour = crossZoneBehaviour;
    },
    customDeadBehaviour(canvas) {
      return {
        initialize(particle) {},
        applyBehaviour: particle => {
          if (particle.p.y + particle.radius >= canvas.height) {
            if (particle.radius > 9) {
              this.miniEmitteing(particle);
              particle.dead = true;
            }
          }
        }
      };
    },

    createMiniEmitter(canvas) {
      const miniEmitter = new Proton.Emitter();
      miniEmitter.rate = new Proton.Rate(
        new Proton.Span(3, 6),
        new Proton.Span(1, 2)
      );

      miniEmitter.addInitialize(new Proton.Mass(1));
      miniEmitter.radiusInitialize = new Proton.Radius();
      miniEmitter.addInitialize(miniEmitter.radiusInitialize);
      miniEmitter.addInitialize(new Proton.Life(0.5, 1));
      miniEmitter.addInitialize(
        new Proton.V(
          new Proton.Span(1.5, 3),
          new Proton.Span(0, 70, true),
          "polar"
        )
      );

      miniEmitter.colorBehaviour = new Proton.Color("#ffffff");
      miniEmitter.addBehaviour(new Proton.Alpha(1, 0));
      miniEmitter.addBehaviour(miniEmitter.colorBehaviour);
      miniEmitter.addBehaviour(new Proton.Gravity(4));
      miniEmitter.addBehaviour(new Proton.Collision(miniEmitter));
      miniEmitter.addBehaviour(
        new Proton.CrossZone(
          new Proton.RectZone(0, 0, canvas.width, canvas.height),
          "bound"
        )
      );
      this.proton.addEmitter(miniEmitter);

      this.miniEmitter = miniEmitter;
    },
    miniEmitteing(particle) {
      const miniEmitter = this.miniEmitter;
      miniEmitter.radiusInitialize.reset(
        particle.radius * 0.05,
        particle.radius * 0.2
      );
      miniEmitter.colorBehaviour.reset(particle.color);
      miniEmitter.p.x = particle.p.x;
      miniEmitter.p.y = particle.p.y;
      miniEmitter.emit("once");
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
