"use strict";
class Pixel {
  x;
  y;
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.c = c;
  }
  get T() {
    return new Coords(this.x, thix.y - 1);
  }
  get TR() {
    return new Coords(this.x + 1, thix.y - 1);
  }
  get TL() {
    return new Coords(this.x - 1, thix.y - 1);
  }
  get B() {
    return new Coords(this.x, thix.y + 1);
  }
  get BR() {
    return new Coords(this.x + 1, thix.y + 1);
  }
  get BL() {
    return new Coords(this.x - 1, thix.y + 1);
  }
  get L() {
    return Coords(this.x - 1, this.y);
  }
  get R() {
    return Coords(this.x + 1, this.y);
  }
}
class Coords {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Item {
  tag;
  content;
  img;
  h;
  loc;
  constructor(tag, content, img, h, loc) {
    (this.tag = tag),
      (this.content = content),
      (this.img = img),
      (this.h = h),
      (this.loc = loc),
      (this.compile = undefined);
  }
  make() {
    //create the structure
  }
}
const DOC = {
  e: document,
  body: document.body,
  get: function (arg) {
    return this.e.querySelector(arg);
  },
  getALL: function (arg) {
    return Array.from(this.e.querySelectorAll(arg));
  },
  create: function (tag, id = "", ...classes) {
    let e = this.e.createElement(tag);
    e.id = id;
    if (classes.length > 1) e.classList.add(classes);
    return e;
  },
};
const Canvas = {
  e: DOC.get("canvas"),
  ctx: DOC.get("canvas").getContext("2d"),
};
