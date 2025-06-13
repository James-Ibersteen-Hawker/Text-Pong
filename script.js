"use strict";
class Game {
  res;
  maxScore;
  roundCount;
  bot;
  destination;
  speed;
  constructor(res, maxScore, roundCount, bot, destination, speed) {
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
      (this.ref = []);
    this.Map();
  }
  Map() {
    const self = this;
    let w = 5,
      h = 6;
    if (h % 2 == 0) h += 1;
    h = Math.max(h, 5);
    let puckInit = false;
    this.grid = Array.from({ length: h * this.res + 3 }, () => {
      let arr = new Array(w * this.res * 2 + 1).fill(this.glyphs.fill);
      return new Proxy(arr, {
        set(t, p, r) {
          let reflect = Reflect.set(t, p, r);
          self.grid.render(puckInit);
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
    this.grid.render = function (arg = false) {
      self.destination.innerHTML = "";
      this.forEach((e) => {
        e.forEach((a) => self.destination.append(a));
        self.destination.insertAdjacentHTML("beforeend", "<br>");
      });
      if (arg) alert("here");
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
    const tempIndex = (h * self.res) / 2;
    this.grid[tempIndex][0] = self.glyphs.goalL;
    this.grid[tempIndex + 1][0] = self.glyphs.goalL;
    this.grid[tempIndex + 2][0] = self.glyphs.goalL;
    this.grid[tempIndex][this.grid[1].length - 1] = self.glyphs.goalR;
    this.grid[tempIndex + 1][this.grid[1].length - 1] = self.glyphs.goalR;
    this.grid[tempIndex + 2][this.grid[1].length - 1] = self.glyphs.goalR;
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
          (this.v = [0, 0]);
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
      move(k) {
        switch (k) {
          case 1:
            this.x += this.moveBy;
            break;
          case -1:
            this.x -= this.moveBy;
            break;
          case 2:
            this.y += this.moveBy;
            break;
          case -2:
            this.y -= this.moveBy;
            break;
        }
        this.d = k;
        this.puck();
      }
      puck() {
        const cells = [
          [self.grid[this.y][this.x - 1], -1],
          [self.grid[this.y][this.x + 1], 1],
          [self.grid[this.y - 1][this.x], -2],
          [self.grid[this.y + 1][this.x], 2],
          [self.grid[this.y - 1][this.x - 1], -3],
          [self.grid[this.y - 1][this.x + 1], -4],
          [self.grid[this.y + 1][this.x - 1], 3],
          [self.grid[this.y + 1][this.x + 1], 4],
        ];
        cells.forEach((e) => {
          if (e[0] == self.glyphs.ball) puck.v = e[1];
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
      }
      updateV() {
        if (this.moveLoop) clearInterval(this.moveLoop);
        this.moveLoop = setInterval(() => {
          switch (this.v) {
            case 1:
              puck.x += 1;
              break;
            case -1:
              puck.x -= 1;
              break;
            case 2:
              puck.y += 1;
              break;
            case -2:
              puck.y -= 1;
              break;
            case 3:
              puck.x -= 1;
              puck.y -= 1;
              break;
            case -3:
              puck.x += 1;
              puck.y += 1;
              break;
            case 4:
              puck.x += 1;
              puck.y -= 1;
              break;
            case -4:
              puck.x -= 1;
              puck.y += 1;
              break;
          }
        }, self.speed);
      }
      bounce(d) {
        if ([1, -1, 2, -2].includes(d)) {
          if (d == this.v) puck.v = -puck.v;
        } else {
          switch (d) {
            case 3:
              puck.v = -3;
              break;
            case -3:
              puck.v = 3;
              break;
            case 4:
              puck.v = -4;
              break;
            case -4:
              puck.v = 4;
              break;
          }
        }
      }
      check() {
        const cells = [
          [self.grid[this.y][this.x - 1], -1],
          [self.grid[this.y][this.x + 1], 1],
          [self.grid[this.y - 1][this.x], -2],
          [self.grid[this.y + 1][this.x], 2],
          [self.grid[this.y - 1][this.x - 1], 3],
          [self.grid[this.y + 1][this.x + 1], -3],
          [self.grid[this.y - 1][this.x + 1], 4],
          [self.grid[this.y + 1][this.x - 1], -4],
        ];
        cells.forEach((e) => {
          if (![self.glyphs.fill, self.glyphs.mid].includes(e[0]))
            this.bounce(e[1]);
        });
      }
    }
    //controls
    const paddleHandler = {
      set(t, p, v) {
        if (p == "d") return Reflect.set(t, p, v);
        if (!["x", "y"].includes(p)) return;
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
    this.rPaddle = new Proxy(
      new Paddle(self.grid[0].length - w - 1, h + 1, "r"),
      paddleHandler
    );
    const puck = new Proxy(new Puck(w * this.res + 1, h + 1, 0), {
      set(t, p, v) {
        const [oX, oY] = [t.x, t.y];
        let reflect = Reflect.set(t, p, v);
        if (p == "v") t.updateV();
        if (["x", "y"].includes(p)) {
          self.grid[oY][oX] = self.base[oY][oX];
          self.grid[t.y][t.x] = self.glyphs.ball;
        }
        return reflect;
      },
    });
    puck.init();

    //eventlisteners
    let moveInterval;
    let keys = [];
    window.addEventListener("keydown", (event) => {
      if (!keys.includes(event.key)) {
        keys.push(event.key);
        const setA = ["w", "a", "s", "d"];
        const setB = ["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];
        if (moveInterval) clearInterval(moveInterval);
        moveInterval = setInterval(() => {
          keys.forEach((k) => {
            let paddle;
            let set;
            if (setA.includes(k)) {
              paddle = self.lPaddle;
              set = setA;
            } else if (setB.includes(k)) {
              paddle = self.rPaddle;
              set = setB;
            }
            switch (set.indexOf(k)) {
              case 0:
                paddle.move(-2);
                break;
              case 1:
                paddle.move(-1);
                break;
              case 2:
                paddle.move(2);
                break;
              case 3:
                paddle.move(1);
                break;
            }
          });
        }, self.speed);
      } else return;
    });
    window.addEventListener("keyup", (event) => {
      keys.splice(keys.indexOf(event.key), 1);
      if (keys.length == 0) clearInterval(moveInterval);
    });
  }
}

let game = new Game(2, 10, 5, false, document.querySelector("#testGrid"), 80);
game.grid.render();
