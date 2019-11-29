<p align="center">
  <img src="https://github.com/lindelof/particles-bg-vue/blob/master/images/logo.png?raw=true"/>
</p>

# particles-bg-vue

[![NPM](https://img.shields.io/npm/v/particles-bg.svg)](https://www.npmjs.com/package/particles-bg) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> A vue.js particles animation background component

This project refers to the source code of the [Proton](https://a-jie.github.io/Proton/) official website, and proton's online [demo](https://codesandbox.io/s/proton-tadpole-yt6qu?fontsize=14&module=%2Fsrc%2Fcomponents%2FParticles.vue). I packaged it into a vue.js component. You can use it casually in your own projects

#### A `React` version of `particles-bg` is here [https://github.com/lindelof/particles-bg](https://github.com/lindelof/particles-bg)

### Online demo
* demo1 [https://codesandbox.io/s/particles-bg-vue-bg145](https://codesandbox.io/s/particles-bg-vue-bg145)
* demo2 [https://codesandbox.io/s/particles-bg-vue-qc1b5](https://codesandbox.io/s/particles-bg-vue-qc1b5)
* custom [https://codesandbox.io/s/particles-bg-vue-2fkvr](https://codesandbox.io/s/particles-bg-vue-2fkvr)

![](https://github.com/lindelof/particles-bg-vue/blob/master/images/01.jpg?raw=true)

![](https://github.com/lindelof/particles-bg-vue/blob/master/images/02.jpg?raw=true)

![](https://github.com/lindelof/particles-bg-vue/blob/master/images/03.jpg?raw=true)

![](https://github.com/lindelof/particles-bg-vue/blob/master/images/04.jpg?raw=true)

![](https://github.com/lindelof/particles-bg-vue/blob/master/images/05.jpg?raw=true)

![](https://github.com/lindelof/particles-bg-vue/blob/master/images/06.jpg?raw=true)

![](https://github.com/lindelof/particles-bg-vue/blob/master/images/07.jpg?raw=true)

## Install

```bash
npm install --save particles-bg-vue
```

## Usage

### Method 1: Import and use in the component

```vue
<particles-bg type="lines" :bg="true" />
...

import { ParticlesBg } from "particles-bg-vue";
export default {
  name: "App",
  components: {
    ParticlesBg
  }
};
```

### Method 2: Use it globally
```vue
import VueParticlesBg from "particles-bg-vue";

Vue.use(VueParticlesBg);

....
<particles-bg type="random" :bg="true" />
```


## Parameter Description
```vue
<particles-bg color="#ff0000" num=200 type="circle" :bg={true} />
```
#### * type - Is the type of particle animation
Is the type of particle animation, `random` is a random selection. You are also free to customize use `custom`.

```js
"color"
"ball"
"lines"
"thick"
"circle"
"cobweb"
"polygon"
"square"
"tadpole"
"fountain"
"random"
"custom"
```

#### * num - The number of particles emitted each time, generally not set

#### * color - The background color or particle color of the particle scene
Notice: which should be an array under type=`color`

#### * canvas - canvas dom style
```vue
:canvas="canvasObject"
...
```

#### * bg - Set to html background
Is set the following properties
```css
position: "absolute",
zIndex: -1,
top: 0,
left: 0
```

## About Custom

![](https://github.com/lindelof/particles-bg-vue/blob/master/images/08.jpg?raw=true)

You can use type="custom" to achieve a higher degree of freedom for the particle background.

```vue
  <particles-bg type="custom" :config="config" :bg="true"/>
  ...
  
  let config = {
      num: [4, 7],
      rps: 0.1,
      radius: [5, 40],
      life: [1.5, 3],
      v: [2, 3],
      tha: [-40, 40],
      alpha: [0.6, 0],
      scale: [1, 0.1],
      position: "center", // all or {x:1,y:1,width:100,height:100}
      color: ["random", "#ff0000"],
      cross: "dead", // cross or bround
      random: 15,  // or null
      onParticleUpdate: (ctx, particle) => {
          ctx.beginPath();
          ctx.rect(particle.p.x, particle.p.y, particle.radius * 2, particle.radius * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          ctx.closePath();
      }
    };
```

## License

https://opensource.org/licenses/MIT
