"use strict";
class Game {
  res;
  maxScore;
  roundCount;
  destination;
  speed;
  scoreDestination;
  constructor(res, maxScore, roundCount, destination, speed, scoreDestination) {
    (this.res = res),
      (this.maxScore = maxScore),
      (this.roundCount = roundCount),
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
        goalL: "]",
        goalR: "[",
        controller: "0",
        fill: " ",
      }),
      (this.grid = []),
      (this.ref = []),
      (this.scores = {
        lScore: 0,
        rScore: 0,
      }),
      (this.scoreDestination = scoreDestination);
    this.Open();
  }
  Map() {
    this.openingFlag = true;
    [this.scoreDestination, this.destination].forEach(self.on);
    const self = this;
    let setRender = false;
    let w = 5;
    let h = 6;
    if (h % 2 == 0) h += 1;
    h = Math.max(h, 5);
    this.grid = Array.from({ length: h * this.res + 3 }, () => {
      let arr = new Array(w * this.res * 2 + 1).fill(this.glyphs.fill);
      return new Proxy(arr, {
        set(t, p, r) {
          let reflect = Reflect.set(t, p, r);
          // self.grid.render();
          setRender = true;
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
    this.scoreDestination.textContent = `Player 1: ${self.scores.lScore}   |   Player 2: ${self.scores.rScore}`;
    this.scores = new Proxy(this.scores, {
      set(t, p, v) {
        let reflect = Reflect.set(t, p, v);
        self.scoreDestination.textContent = "SCORE";
        puck.v = [0, 0];
        puck.bounceFlag = true;
        setTimeout(() => {
          puck.x = w * self.res + 1;
          puck.y = h + 1;
          puck.v = [0, 0];
          puck.bounceFlag = false;
          self.lPaddle.x = w;
          self.lPaddle.y = h + 1;
          self.rPaddle.x = self.grid[0].length - w - 1;
          self.rPaddle.y = h + 1;
          self.scoreDestination.textContent = `Player 1: ${self.scores.lScore}   |   Player 2: ${self.scores.rScore}`;
        }, 750);
        if (self.scores[p] == self.maxScore) {
          alert("game over");
          location.reload();
        }
        return reflect;
      },
      get(t, p, v) {
        return Reflect.get(t, p, v);
      },
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
      setRender = false;
    };
    this.grid.forEach((e) => {
      e.forEach((_, i) => {
        if (i == w * self.res + 1) e.splice(i, 0, self.glyphs.mid);
        else if (i == 0) e.splice(i, 1, this.glyphs.sides);
      });
      e.push(self.glyphs.sides);
    });
    this.grid[0].fill(this.glyphs.tbEdge);
    this.grid.at(-1).fill(this.glyphs.tbEdge);
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
    this.setHoriz = [
      new Array(this.base[0].length)
        .fill(null)
        .map((_, i) => [self.base.length - 1, i]),
      new Array(this.base[0].length).fill(null).map((_, i) => [0, i]),
    ];
    this.setVert = [
      new Array(this.base.length).fill(null).map((_, i) => [i, 0]),
      new Array(this.base.length)
        .fill(null)
        .map((_, i) => [i, this.base[0].length - 1]),
    ];
    this.setCorner = [
      [0, 0],
      [0, this.base[0].length - 1],
      [this.base.length - 1, 0],
      [this.base.length - 1, this.base[0].length - 1],
    ];
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
        if (puck.bounceFlag == true) return;
        let m = bitTable[c];
        m == undefined ? (m = [0, 0]) : m;
        this.tempV = [...m];
        if (
          Math.abs(self.lPaddle.x - self.rPaddle.x) < 4 &&
          self.lPaddle.y == self.rPaddle.y &&
          (self.lPaddle.tempV[0] == 1 || self.rPaddle.tempV[0] == -1)
        )
          return;
        else {
          const hasPuck = this.x + m[0] == puck.x && this.y + m[1] == puck.y;
          if (!hasPuck) {
            this.x += m[0];
            this.y += m[1];
          }
          this.v = [...m];
          this.hitPuck();
        }
      }
      hitPuck() {
        const [x, y] = [this.x, this.y];
        const coords = Object.values(bitTable);
        coords.forEach((c) => {
          const [tX, tY] = c;
          if (x + tX == puck.x && y + tY == puck.y) {
            if (tX == this.v[0] && tY == this.v[1]) puck.v = c;
          }
        });
      }
    }
    class Puck {
      x;
      y;
      v;
      constructor(x, y, v) {
        (this.x = x),
          (this.y = y),
          (this.v = v),
          (this.moveLoop = undefined),
          (this.bounceFlag = false);
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
          if (this.v[0] != 0 || this.v[1] != 0) {
            puck.x += this.v[0];
            puck.y += this.v[1];
            this.check();
          }
          if (setRender == true) self.grid.render();
        }, self.speed);
      }
      bounce(d) {
        const [x, y] = [this.x, this.y];
        const [vX, vY] = this.v;
        const [dX, dY] = d;
        if (self.setCorner.some((v) => v[0] == y + dY && v[1] == x + dX))
          this.v = [-this.v[0], -this.v[1]];
        else if (
          self.setHoriz[0].some((v) => v[0] == y + dY && v[1] == x + dX) ||
          self.setHoriz[1].some((v) => v[0] == y + dY && v[1] == x + dX)
        )
          this.v = [this.v[0], -this.v[1]];
        else if (
          self.setVert[0].some((v) => v[0] == y + dY && v[1] == x + dX) ||
          self.setVert[1].some((v) => v[0] == y + dY && v[1] == x + dX)
        )
          this.v = [-this.v[0], this.v[1]];
        else this.v = [-this.v[0], -this.v[1]];
      }
      check() {
        if (
          ![self.glyphs.fill, self.glyphs.mid].includes(
            self.grid[this.y + this.v[1]][this.x + this.v[0]]
          )
        ) {
          const [x, y] = [this.x + this.v[0], this.y + this.v[1]];
          if (self.grid[y][x] != self.glyphs.controller) this.bounceFlag = true;
          else this.bounceFlag = false;
          if (self.grid[this.y][x] == self.glyphs.goalR)
            this.score(self.lPaddle.side);
          else if (self.grid[this.y][x] == self.glyphs.goalL)
            this.score(self.rPaddle.side);
          this.bounce(this.v);
        } else this.bounceFlag = false;
      }
      score(side) {
        switch (side) {
          case "r":
            self.scores.rScore++;
            break;
          case "l":
            self.scores.lScore++;
            break;
        }
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
  async Open() {
    this.openingFlag = false;
    const self = this;
    const time = 250;
    HTMLElement.prototype.Type = function (arg, t) {
      const inSelf = this;
      return new Promise((resolve, reject) => {
        try {
          arg = arg.split("");
          arg.forEach((e, i) => setTimeout(() => inSelf.append(e), i * t));
          setTimeout(() => resolve(inSelf), arg.length * t);
        } catch (error) {
          reject(error);
        }
      });
    };
    HTMLElement.prototype.select = async function (t, bool = false, func = false) {
      const save = this.textContent;
      const inSelf = this;
      const text = save.split("");
      const swap = [">", " "];
      const end = text.slice(1).join("");
      let i = swap.indexOf(text[0]);
      const interval = setInterval(
        () => (this.textContent = swap[(i ^= 1)] + end),
        t
      );
      if (bool == true) {
        return new Promise(async (resolve, reject) => {
        const controlFunction = async (e) => {
          if (e.key == "Enter") {
            clearInterval(interval);
            window.removeEventListener("keyup", controlFunction);
            if (func) {
              await func();
              resolve();
            }
            else reject("no function");
          }
        };
        window.addEventListener("keyup", controlFunction);
        });
      }
      return {
        stop() {
          clearInterval(interval);
          inSelf.textContent = save;
        },
      };
    };
    HTMLElement.prototype.falseInput = function (bool = false, keyArr, func, id) {
      if (!bool) {
        if (!this[id]) {
        const listener = (e) => {
          if (keyArr.includes(e.key)) func(e);
        }
        this[id] = listener;
        this.addEventListener("keydown", this[id]);
        }
        return id;
      } else {
        if (this[id]) {
          this.removeEventListener("keydown", this[id]);
          this[id] = undefined;
        }
      }
    }
    const opening = document.querySelector("#opening");
    [this.scoreDestination, this.destination].forEach(self.off);
    try {
    await opening.Type("Javascript Air Hockey", time)
    const play = document.createElement("div");
    opening.insertAdjacentHTML("beforeend", "<br><br>");
    opening.append(play);
    await play.Type("  Play", time);
    await play.select(time, true, async () => {
      opening.textContent = "";
      play.remove();
      await opening.Type("Input Player Names:", time);
    });
    alert("here");
    const [p1, p2] = new Array(2).fill(null).map(() => document.createElement("div"));
    const [ph1, ph2] = new Array(2).fill(null).map(() => document.createElement("div"));
    opening.append(ph1);
    opening.append(p1);
    await ph1.Type("Player 1 Name:", time);
    const nameMax = 10;
    const p1ID = p1.falseInput(false, ['a', 'b', 'c', 'd', 'e', 'f', 'g','h', 'i', 'j', 'k', 'l', 'm', 'n','o', 'p', 'q', 'r', 's', 't', 'u','v', 'w', 'x', 'y', 'z'], (e) => {
      alert("falseinput");
      e.preventDefault();
      if (p1.textContent.length - 1 <= nameMax) p1.insertAdjacentText("beforeend", e.key);
    }, Symbol("type"));
    const p1ID2 = p1.falseInput(false, ["Backspace"], (e) => {
      alert("backspace");
      e.preventDefault();
      p1.textContent = p1.textContent.substring(0,p1.textContent.length - 1);
    }, Symbol("del"));
    await p1.select(time, true, () => {
      p1.falseInput(true, null, null, p1ID);
      p1.falseInput(true, null, null, p1ID2);
      alert("finished inputting player1 name");
    }
    } catch (error) {
      throw new Error(error);
    }
  }
  off(e) {
    e.setAttribute("style", "display: none;");
  }
  on(e) {
    e.setAttribute("style", "display: block;");
  }
}
let game = new Game(
  2,
  4,
  5,
  document.querySelector("#pong"),
  80,
  document.querySelector("#scores")
);
