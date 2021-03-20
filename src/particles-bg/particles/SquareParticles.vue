<template>
  <canvas-comp
    :bg="bg"
    :canvas="canvas"
    global-composite-operation="lighter"
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

const colors = [
  "#fad390",
  "#81ecec",
  "#ffffff",
  "#badc58",
  "#f9ca24",
  "#FEA47F"
];
export default {
  name: "SquareParticles",
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
      const dis = 150;
      this.crossZoneBehaviour.zone.width = width + 2 * dis;
      this.crossZoneBehaviour.zone.height = height + 2 * dis;
      this.proton.renderers[0].resize(width, height);
    },
    canvasMouseDown(e) {},

    createProton(canvas) {
      const width = canvas.width;
      const height = canvas.height;
      this.proton = new Proton();
      const emitter = new Proton.Emitter();
      emitter.rate = new Proton.Rate(this.num ? this.num : 50);
      emitter.damping = 0;

      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(4, 70));
      emitter.addInitialize(
        new Proton.Velocity(new Proton.Span(4, 12), 180, "polar")
      );
      emitter.addInitialize(
        new Proton.Position(new Proton.LineZone(0, 0, canvas.width, 0))
      );

      const dis = 150;
      const crossZoneBehaviour = new Proton.CrossZone(
        new Proton.RectZone(
          0 - dis,
          0 - dis,
          canvas.width + 2 * dis,
          canvas.height + 2 * dis
        ),
        "cross"
      );
      emitter.addBehaviour(crossZoneBehaviour);
      emitter.addBehaviour(new Proton.Alpha(Proton.getSpan(0.1, 0.55)));
      emitter.addBehaviour(new Proton.Color(colors));

      emitter.emit("once");
      this.proton.addEmitter(emitter);
      const renderer = this.createRenderer(canvas);
      this.proton.addRenderer(renderer);

      this.crossZoneBehaviour = crossZoneBehaviour;
      emitter.preEmit(2);
    },
    createRenderer(canvas) {
      const context = canvas.getContext("2d");
      const renderer = new Proton.CustomRenderer();

      renderer.onProtonUpdate = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleCreated = particle => {
        const w = particle.radius || 60;
        const h = Proton.MathUtil.randomAToB(100, 200, "int");
        particle.data.w = w;
        particle.data.h = h;
      };

      renderer.onParticleUpdate = particle => {
        const w = particle.data.w;
        const h = particle.data.h;
        context.save();
        context.globalAlpha = particle.alpha;
        context.fillStyle = particle.color;

        context.translate(particle.p.x, particle.p.y);
        context.rotate(Proton.MathUtil.degreeTransform(particle.rotation));
        context.translate(-particle.p.x, -particle.p.y);

        context.beginPath();
        context.rect(particle.p.x - w / 2, particle.p.y - h / 2, w, h);

        context.closePath();
        context.fill();
        context.globalAlpha = 1;
        context.restore();
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
