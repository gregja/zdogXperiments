const {
  TimelineMax,
  TweenMax,
  Power0,
  Zdog: {
    Anchor,
    Cylinder,
    Illustration,
    TAU,
    Shape,
    Group,
    RoundedRect,
    Rect,
  },
} = window

const DIAMETER = 50

const Scene = new Illustration({
  element: 'canvas',
  resize: 'fullscreen',
  dragRotate: true,
  rotate: {
    x: TAU * 0.075,
    y: TAU * -0.175,
  },
})

const Strap = new Group({
  addTo: Scene,
  translate: {
    y: DIAMETER,
    z: -15,
  },
})
const StrapTop = new RoundedRect({
  addTo: Strap,
  color: '#111',
  fill: 'true',
  stroke: 10,
  width: DIAMETER,
  height: DIAMETER * 6,
  cornerRadius: 15,
})
const Buckle = new RoundedRect({
  addTo: StrapTop,
  width: DIAMETER + 10,
  height: DIAMETER * 0.6,
  cornerRadius: 5,
  color: 'silver',
  stroke: 10,
  translate: {
    y: -DIAMETER * 3.4,
  },
})
new Rect({
  addTo: StrapTop,
  width: DIAMETER,
  color: '#111',
  height: DIAMETER,
  stroke: 10,
  translate: {
    y: -DIAMETER * 2.45,
  },
})
new Shape({
  addTo: Buckle,
  color: 'silver',
  stroke: 5,
  path: [
    {
      x: 0,
      y: -6,
    },
    {
      x: 0,
      y: 12,
    },
  ],
})

const Face = new Group({
  addTo: Scene,
  translate: {
    z: 10,
  },
})
new Cylinder({
  addTo: Face,
  diameter: DIAMETER * 2,
  length: 15,
  color: 'silver',
  frontFace: '#fff',
  backface: '#111',
  translate: {
    z: -10,
  },
})

const startDate = new Date()

const createHand = (color, length, stroke, start, increment) => {
  // Handle Seconds
  const Center = new Anchor({
    addTo: Face,
    rotate: {
      z: start,
    },
  })
  // Seconds Hand
  new Shape({
    addTo: Center,
    color,
    stroke,
    backface: '#111',
    path: [
      { x: 0, y: 0 },
      {
        x: 0,
        y: -length,
      },
    ],
  })
  // Set up seconds timeline 🎥
  new TimelineMax({
    repeat: -1,
    // Required to set a new value for GSAP to tween from 👍
    onRepeat: () => (Center.rotate.z += increment),
  }).add(
    TweenMax.to(Center.rotate, 1, {
      ease: Power0.easeNone,
      z: (Center.rotate.z += increment),
    })
  )
}
const START_SECOND = (startDate.getSeconds() * TAU) / 60
const START_MINUTE =
  (startDate.getMinutes() * TAU) / 60 + (startDate.getSeconds() * TAU) / 60 / 60
const START_HOUR =
  ((startDate.getHours() % 12) * TAU) / 12 +
  (startDate.getMinutes() * TAU) / 12 / 60 +
  (startDate.getSeconds() * TAU) / 12 / 60 / 60
createHand('red', DIAMETER * 0.8, 2, START_SECOND, TAU / 60)
createHand('#111', DIAMETER * 0.8, 3, START_MINUTE, TAU / 60 / 60)
createHand('#111', DIAMETER * 0.5, 3, START_HOUR, TAU / 60 / 60 / 60) // Create the notched
for (let n = 1; n < 13; n++) {
  const Notch = new Anchor({
    backface: '#111',
    addTo: Face,
    rotate: {
      z: (n * TAU) / 12,
    },
  })
  new Shape({
    addTo: Notch,
    color: '#666',
    backface: '#111',
    stroke: n % 3 === 0 ? 5 : 2,
    translate: {
      y: DIAMETER * 0.8,
    },
  })
}
const draw = () => {
  Scene.rotate.y += 0.004
  Scene.updateRenderGraph()
  requestAnimationFrame(draw)
}

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    // Get the ball rolling ⚽️
    draw()
});
