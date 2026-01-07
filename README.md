# react-canvas-platformer

This a project in progress, keep tight, cool stuff are coming soon

A 2D platformer prototype built with React and HTML5 Canvas, focusing on game loops, physics, and clean separation between declarative UI and imperative rendering.

## Architecture overview

```text
React App (lifecycle + UI)
│
├─ App
│   ├─ UI (score, pause, menus)
│   └─ GameCanvas
│       │
│       ├─ Game Loop (engine)
│       │   ├─ Updates game state (positions, velocity, physics)
│       │   └─ Runs via requestAnimationFrame
│       │
│       └─ Canvas Renderer
│           ├─ Clears canvas
│           └─ Draws current game state
│
└─ Browser
    └─ requestAnimationFrame (timing)
```

## Core ideas

- React ows lifecycle and UI only,

- The game engine runs outside React renders,

- Canvas redraws the entire scene every frame,

- Game state lives in plain JavaScript objects,

This is an educational and architectural project, not a full game engine.