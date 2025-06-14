"use strict";
class Game {
  res;
  maxScore;
  roundCount;
  bot;
  destination;
  speed;
  directContact;
  constructor(
    res,
    maxScore,
    roundCount,
    bot,
    destination,
    speed,
    directContact
  ) {
    (this.res = res),
      (this.maxScore = maxScore),
      (this.roundCount = roundCount),
      (this.bot = bot),
      (this.scores = {
        score1: 0,
        score2: 0,
      }),
      (this.speed = speed),
      (this.destination = destination),
      (this.glyphs = {
        mid: "ǁ",
        tbEdge: "-",
        ball: "█",
        sides: ":",
        corner: "+",
        goalL: "]",
        goalR: "[",
        controller: "0",
        fill: " ",
      }),
      (this.grid = []),
      (this.ref = []),
      (this.directContact = directContact);
    this.Map();
  }
  Map() {
    let tick = false;
    const globalTick = setInterval(() => {
      tick = !tick;
    }, this.speed);
    const self = this;
    let w = 5;
    let h = 6;
    if (h % 2 == 0) h += 1;
    h = Math.max(h, 5);
    let puckInit = false;
    this.grid = Array.from({ length: h * this.res + 3 }, () => {
      let arr = new Array(w * this.res * 2 + 1).fill(this.glyphs.fill);
      return new Proxy(arr, {
        set(t, p, r) {
          let reflect = Reflect.set(t, p, r);
          self.grid.render();
          return reflect;
        },
        get(t, p, r) {
          if (p == "self") return this.target;
          return Reflect.get(t, p, r);
        },
        target: arr,
      });
    });
    this.ref = Array.from({ length: this.grid.length }, (_, i) => {
      return [...this.grid[i].self].map(() => "b");
    });
    for (let i = 0; i < this.ref.length; i++) {
      for (let q = 0; q < this.ref[i].length; q++) {
        this.ref[i][q] = `${i}_${q}`;
      }
    }
    this.ref = this.ref.flat();
    this.grid.lookUp = function (i) {
      let [k, q] = self.ref[i].split("_").map((v) => Number(v));
      return this[k][q];
    };
    this.grid.render = function () {
      self.destination.innerHTML = "";
      this.forEach((e) => {
        e.forEach((a) => self.destination.append(a));
        self.destination.insertAdjacentHTML("beforeend", "<br>");
      });
      if (puckInit) {
        if (
          (puck.x == self.lPaddle.x && puck.y == self.lPaddle.y) ||
          (puck.x == self.lPaddle.x && puck.y == self.lPaddle.y)
        ) {
          puck.x += puck.v[0];
          puck.y += puck.v[1];
        }
      }
    };
    this.grid[0].fill(this.glyphs.tbEdge);
    this.grid.at(-1).fill(this.glyphs.tbEdge);
    this.grid.forEach((e) => {
      e.forEach((_, i) => {
        if (i == w * self.res + 1) e.splice(i, 0, self.glyphs.mid);
        else if (i == 0) e.splice(i, 1, this.glyphs.sides);
      });
      e.push(self.glyphs.sides);
    });
    const tI = (h * self.res) / 2;
    this.grid[tI][0] = self.glyphs.goalL;
    this.grid[tI + 1][0] = self.glyphs.goalL;
    this.grid[tI + 2][0] = self.glyphs.goalL;
    this.grid[tI][this.grid[1].length - 1] = self.glyphs.goalR;
    this.grid[tI + 1][this.grid[1].length - 1] = self.glyphs.goalR;
    this.grid[tI + 2][this.grid[1].length - 1] = self.glyphs.goalR;
    this.base = Array.from({ length: this.grid.length }, (_, i) => {
      return new Proxy([...this.grid[i].self], {
        set(t, p, r) {
          throw new Error("Blocked modification of base");
        },
        get(t, p, r) {
          return Reflect.get(t, p, r);
        },
      });
    });
    const bitTable = {
      0: [0, 0],
      1: [0, -1],
      2: [-1, 0],
      4: [0, 1],
      8: [1, 0],
      3: [-1, -1],
      6: [-1, 1],
      9: [1, -1],
      12: [1, 1],
    };
    //control classes
    class Paddle {
      x;
      y;
      side;
      constructor(x, y, side) {
        (this.x = x),
          (this.y = y),
          (this.side = side),
          (this.d = undefined),
          (this.moveBy = 1),
          (this.v = [0, 0]),
          this.init();
      }
      init() {
        self.grid[this.y][this.x] = self.glyphs.controller;
        this.sides = new Array(self.grid.length)
          .fill()
          .map(() => new Array(self.grid[0].length).fill(false));
        this.sides.forEach((e, q, pArr) => {
          e.forEach((a, i, arr) => {
            if (q > 0 && q < pArr.length - 1) {
              if (i > 0 && i < arr.length - 1) {
                switch (this.side) {
                  case "r":
                    if (i > w * self.res + 1) arr.splice(i, 1, true);
                    break;
                  case "l":
                    if (i < w * self.res + 1) arr.splice(i, 1, true);
                    break;
                }
              }
            }
          });
        });
        this.sides = this.sides.map((e) => {
          return new Proxy(e, {
            set(t, p, r) {
              throw new Error("Cannot change sides array");
            },
          });
        });
      }
      move(c) {
        let m = bitTable[c];
        m == undefined ? (m = [0, 0]) : m;
        this.x += m[0];
        this.y += m[1];
        this.v = [...m];
        this.hitPuck();
      }
      hitPuck() {
        const [x, y] = [this.x, this.y];
        const coords = Object.values(bitTable);
        coords.forEach((c) => {
          const [tX, tY] = c;
          if (this.directContact == true) {
            if (x + tX == puck.x && y + tY == puck.y) {
              if (tX == this.v[0] && tY == this.v[1]) puck.v = c;
            }
          } else {
            if (x + tX == puck.x && y + tY == puck.y) {
              puck.v = c;
            }
          }
        });
      }
    }
    class Puck {
      x;
      y;
      v;
      constructor(x, y, v) {
        (this.x = x), (this.y = y), (this.v = v), (this.moveLoop = undefined);
      }
      init() {
        self.grid[this.y][this.x] = self.glyphs.ball;
        this.map = new Array(self.grid.length)
          .fill()
          .map(() => new Array(self.grid[0].length).fill(false));
        self.grid.forEach((e, q) => {
          e.forEach((a, i) => {
            if ([self.glyphs.fill, self.glyphs.mid].includes(a))
              this.map[q][i] = true;
          });
        });
        if (this.moveLoop) clearInterval(this.moveLoop);
        this.moveLoop = setInterval(() => {
          if (puckFlag == true) {
            const set1 = keys.filter((v) => !v.includes("Arrow"));
            const set2 = keys.filter((v) => v.includes("Arrow"));
            let control1 = 0;
            let control2 = 0;
            set1.forEach((e) => (control1 = control1 | bitLookUp[e]));
            set2.forEach((e) => (control2 = control2 | bitLookUp[e]));
            self.lPaddle.move(control1);
            self.rPaddle.move(control2);
          }
          self.grid[self.lPaddle.y][self.lPaddle.x] = self.glyphs.controller;
          self.grid[self.rPaddle.y][self.rPaddle.x] = self.glyphs.controller;
          puck.x += this.v[0];
          puck.y += this.v[1];
          this.check();
        }, self.speed);
        puckInit = true;
      }
      bounce(d, bool) {
        if (bool == false) puck.v = [-this.v[0], -this.v[1]];
        else if (bool == true) {
          console.log("in puck");
          puck.v = [-this.v[0], -this.v[1]];
        }
      }
      check() {
        let set = new Array(2).fill(null).map(() => [0, 0]);
        const [x, y] = [this.x, this.y];
        set[0][0] = this.v[0];
        set[1][1] = this.v[1];
        set = set.filter((v) => [Math.abs(v[0]), Math.abs(v[1])].includes(1));
        set.forEach((s) => {
          const t = self.grid[y + s[1]][x + s[0]];
          const wall = ![self.glyphs.fill, self.glyphs.mid].includes(t);
          const onPuckL = x == self.lPaddle.x && y == self.lPaddle.y;
          const onPuckR = x == self.rPaddle.x && y == self.rPaddle.y;
          if (wall && !onPuckL && !onPuckR) this.bounce(s, false);
          else if (onPuckL || onPuckR) this.bounce(s, true);
        });
      }
    }
    //controls
    const paddleHandler = {
      set(t, p, v) {
        if (p == "d") return Reflect.set(t, p, v);
        if (!["x", "y"].includes(p)) return Reflect.set(t, p, v);
        else {
          const [oX, oY] = [t.x, t.y];
          self.grid[oY][oX] = self.base[oY][oX];
          let reflect = Reflect.set(t, p, v);
          if (
            t.y > 0 &&
            t.x > 0 &&
            t.y < self.grid.length &&
            t.x < self.grid[0].length
          ) {
            if (t.sides[t.y][t.x] == true) {
              self.grid[t.y][t.x] = self.glyphs.controller;
              return reflect;
            } else {
              let [nX, nY] = [t.x, t.y];
              while (t.sides[nY][nX] != true) {
                if (t.x > oX) nX -= 1;
                else if (t.x < oX) nX += 1;
                if (t.y > oY) nY -= 1;
                else if (t.y < oY) nY += 1;
              }
              self.grid[nY][nX] = self.glyphs.controller;
              p == "x" ? (v = nX) : (v = nY);
              return Reflect.set(t, p, v);
            }
          } else {
            let [nX, nY] = [t.x, t.y];
            nX = Math.max(1, Math.min(nX, self.grid[0].length - 2));
            nY = Math.max(1, Math.min(nY, self.grid.length - 2));
            self.grid[nY][nX] = self.glyphs.controller;
            p == "x" ? (v = nX) : (v = nY);
            return Reflect.set(t, p, v);
          }
        }
      },
    };
    this.lPaddle = new Proxy(new Paddle(w, h + 1, "l"), paddleHandler);
    let tempHalf = self.grid[0].length - w - 1;
    this.rPaddle = new Proxy(new Paddle(tempHalf, h + 1, "r"), paddleHandler);
    const puck = new Proxy(new Puck(w * this.res + 1, h + 1, [0, 0]), {
      set(t, p, v) {
        const [oX, oY] = [t.x, t.y];
        let reflect = Reflect.set(t, p, v);
        if (["x", "y"].includes(p)) {
          self.grid[oY][oX] = self.base[oY][oX];
          self.grid[t.y][t.x] = self.glyphs.ball;
        }
        return reflect;
      },
    });
    puck.init();
    //eventlisteners
    const wasd = Object.fromEntries(
      ["w", "a", "s", "d"].map((v, i) => [v, Math.pow(2, i)])
    );
    const arrows = Object.fromEntries(
      ["Up", "Left", "Down", "Right"].map((v, i) => [
        `Arrow${v}`,
        Math.pow(2, i),
      ])
    );
    const bitLookUp = { ...wasd, ...arrows };
    const keySet = [
      "w",
      "a",
      "s",
      "d",
      "ArrowUp",
      "ArrowDown",
      "ArrowRight",
      "ArrowLeft",
    ];
    const keys = [];
    let puckFlag = false;
    window.addEventListener("keydown", (event) => {
      if (!keySet.includes(event.key)) return;
      if (keys.includes(event.key)) return;
      keys.push(event.key);
      puckFlag = true;
    });
    window.addEventListener("keyup", (event) => {
      let i = keys.indexOf(event.key);
      if (i != -1) keys.splice(i, 1);
      if (keys.length == 0) puckFlag = false;
    });
  }
}
let game = new Game(
  2,
  10,
  5,
  false,
  document.querySelector("#testGrid"),
  80,
  false
);
game.grid.render();
