"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
class Pixel {
  x;
  y;
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.c = c;
  }
  get T() {
    return {
      x: this.x,
      y: this.y - 1,
    };
  }
  get TR() {
    return this.y - 1;
  }
  get TL() {}
  get R() {}
  get L() {}
  get B() {}
  get BR() {}
  get BL() {}
}
class Coords {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  box();
  scan(ctx);
});
function scan(ctx) {}
function box() {
  ctx.fillStyle = "red";
  ctx.fillRect(50, 50, 400, 400);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(250, 349);
  ctx.stroke();
}
