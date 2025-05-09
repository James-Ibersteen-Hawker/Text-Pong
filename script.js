"use strict";
// window.onload = function grab() {
//   fetch("demo.txt")
//     .then((result) => {
//       return result.text();
//     })
//     .then((data) => {
//       data = data.split(":")[2];
//       return fetch(data);
//     })
//     .then((result) => {
//       return result.url;
//     })
//     .then((data) => console.log(data))
//     .catch((error) => console.error("error"));
// };

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
class pixel {
  x;
  y;
  c;
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.c = c;
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
