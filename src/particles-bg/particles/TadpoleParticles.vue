<template>
  <canvas-comp
    :bg="bg"
    :canvas="canvas"
    global-composite-operation="xor"
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
  name: "TadpoleParticles",
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
      emitter.damping = 0.008;
      emitter.rate = new Proton.Rate(this.num ? this.num : 50);
      emitter.addInitialize(new Proton.Mass(1));
      emitter.addInitialize(new Proton.Radius(5, 9));
      emitter.addInitialize(
        new Proton.Velocity(
          new Proton.Span(1.5),
          new Proton.Span(0, 360),
          "polar"
        )
      );
      emitter.addInitialize(
        new Proton.Position(new Proton.RectZone(0, 0, width, height))
      );

      const mouseInfo = {
        x: width / 2,
        y: height / 2
      };

      const attractionBehaviour = new Proton.Attraction(mouseInfo, 0, 0);
      const crossZoneBehaviour = new Proton.CrossZone(
        new Proton.RectZone(0, 0, canvas.width, canvas.height),
        "bound"
      );
      emitter.addBehaviour(new Proton.Color(this.color || "#bbbbbb"));
      //emitter.addBehaviour(new Proton.Alpha(new Proton.Span(0.5, 1)));
      emitter.addBehaviour(attractionBehaviour, crossZoneBehaviour);
      emitter.addBehaviour(new Proton.RandomDrift(15, 15, 0.05));
      emitter.emit("once");

      this.proton.addEmitter(emitter);
      this.proton.addRenderer(this.createRenderer(canvas));
      this.crossZoneBehaviour = crossZoneBehaviour;
    },
    createRenderer(canvas) {
      const jointCount = 12;
      const delayTime = 6;
      const context = canvas.getContext("2d");
      const renderer = new Proton.CanvasRenderer(canvas);

      renderer.onProtonUpdate = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
      };

      renderer.onParticleCreated = particle => {
        particle.data.points = [];
        particle.data.index = 0;
      };

      renderer.onParticleUpdate = function(particle) {
        drawTadpoleTail(particle);
        if (particle.data.index % delayTime === 0) fillPointsData(particle);
        drawTadpoleHead(particle);
        particle.data.index++;
      };

      const fillPointsData = particle => {
        particle.data.points.unshift(particle.p.y);
        particle.data.points.unshift(particle.p.x);

        if (particle.data.points.length > jointCount) {
          particle.data.points.pop();
          particle.data.points.pop();
        }
      };

      const drawTadpoleHead = particle => {
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(
          particle.p.x,
          particle.p.y,
          particle.radius,
          0,
          Math.PI * 2,
          true
        );
        context.closePath();
        context.fill();
      };

      const drawTadpoleTail = particle => {
        context.beginPath();
        context.strokeStyle = particle.color;

        context.moveTo(particle.p.x, particle.p.y);

        const l = particle.data.points.length;
        for (let i = 0; i < l; i += 2) {
          const x = particle.data.points[i];
          const y = particle.data.points[i + 1];

          context.lineWidth = linearEvaluation(i, l);
          context.lineTo(x, y);
          context.stroke();
        }
      };

      const linearEvaluation = (i, l) => {
        if (l <= 2) return 1;

        const max = 6;
        const A = (max - 1) / (2 / l - 1);
        const B = 1 - A;
        const X = (i + 2) / l;
        let val = A * X + B;
        val = val >> 0;

        return val;
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
