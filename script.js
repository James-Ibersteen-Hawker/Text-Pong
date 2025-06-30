"use strict";
class Game {
  maxScore;
  roundCount;
  gameDestination;
  speed;
  speedUp;
  typeSpeed;
  w;
  h;
  constructor(
    maxScore,
    roundCount,
    gameDestination,
    speed,
    speedUp,
    typeSpeed,
    w,
    h
  ) {
    (this.res = 2),
      (this.maxScore = maxScore),
      (this.roundCount = roundCount),
      (this.scores = {
        score1: 0,
        score2: 0,
      }),
      (this.speed = speed),
      (this.speedUp = speedUp),
      (this.typeSpeed = typeSpeed),
      (this.gameDestination = gameDestination),
      (this.w = w),
      (this.h = h),
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
      (this.players = {
        r: undefined,
        l: undefined,
      }),
      this.Open();
  }
  Map() {
    const self = this;
    this.openingFlag = true;
    const scoresDestination = document.createElement("div");
    const innerDestination = document.createElement("div");
    this.gameDestination.append(scoresDestination);
    this.gameDestination.insertAdjacentHTML("beforeend", "<br><br>");
    this.gameDestination.append(innerDestination);
    this.destination = innerDestination;
    this.scoreDestination = scoresDestination;
    let setRender = false;
    let w = this.w;
    let h = this.h;
    if (h % 2 == 0) h += 1;
    h = Math.max(h, 5);
    this.grid = Array.from({ length: h * this.res + 3 }, () => {
      let arr = new Array(w * this.res * 2 + 1).fill(this.glyphs.fill);
      return new Proxy(arr, {
        set(t, p, r) {
          let reflect = Reflect.set(t, p, r);
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
    if (self.players.l == " ") self.players.l = "Player 1";
    if (self.players.r == " ") self.players.r = "Player 2";
    this.scoreDestination.textContent = `${self.players.l} ${self.scores.lScore}   |   ${self.players.r} ${self.scores.rScore}`;
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
          self.scoreDestination.textContent = `${self.players.l}: ${self.scores.lScore}   |   ${self.players.r}: ${self.scores.rScore}`;
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
    let time = self.typeSpeed;
    const speedUpInt = self.speedUp;
    const selectTime = self.typeSpeed;
    function Time() {
      return time;
    }
    let typeFlag = false;
    let enterFlag = false;
    HTMLElement.prototype.Type = function (arg, mult) {
      const inSelf = this;
      return new Promise(async (resolveAll, reject) => {
        try {
          typeFlag = true;
          arg = arg.split("");
          for (let i = 0; i < arg.length; i++) {
            await letter(arg[i], Time() * mult);
            if (i == arg.length - 1) {
              resolveAll(inSelf);
              typeFlag = false;
            }
          }
          function letter(v, t) {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                inSelf.append(v);
                resolve();
              }, t);
            });
          }
        } catch (error) {
          reject(error);
        }
      });
    };
    HTMLElement.prototype.select = async function (
      t,
      bool = false,
      func = false
    ) {
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
          let flag = false;
          const flagFunc = () => {
            flag = false;
          };
          const controlFunction = async (e) => {
            if (enterFlag == true) return;
            if (flag == true) return;
            if (e.key == "Enter") {
              flag = true;
              clearInterval(interval);
              window.removeEventListener("keydown", controlFunction);
              window.removeEventListener("keyup", flagFunc);
              if (func) {
                await func();
                resolve();
              } else reject("no function");
            }
          };
          window.addEventListener("keydown", controlFunction);
          window.addEventListener("keyup", flagFunc);
        });
      }
      return {
        stop() {
          clearInterval(interval);
          inSelf.textContent = save;
        },
      };
    };
    HTMLElement.prototype.falseInput = function (
      bool,
      keyArr,
      func,
      id = "Default"
    ) {
      if (bool == false) {
        if (!this[id]) {
          const listener = (e) => {
            if (keyArr.includes(e.key)) func(e);
          };
          this[id] = listener;
          window.addEventListener("keydown", this[id]);
        } else console.log(`${e.key} is not in ${keyArr}`);
        return id;
      } else {
        if (this[id]) {
          window.removeEventListener("keydown", this[id]);
          this[id] = undefined;
        }
      }
    };
    const opening = self.gameDestination;
    try {
      window.addEventListener("keydown", (e) => {
        if (typeFlag == true && enterFlag == false) {
          if (e.key == "Enter") {
            time /= speedUpInt;
            enterFlag = true;
          }
        }
      });
      window.addEventListener("keyup", (e) => {
        if (enterFlag == true) {
          enterFlag = false;
          time *= speedUpInt;
        }
      });
      function br(e) {
        e.insertAdjacentHTML("beforeend", "<br><br>");
      }
      await opening.Type("Javascript Air Hockey", 1);
      const play = document.createElement("div");
      br(opening);
      opening.append(play);
      await play.Type("  Play", 1);
      await play.select(selectTime, true, async () => {
        opening.textContent = "";
        play.remove();
        await opening.Type("Input Player Names:", 1);
      });
      const [p1, p2, ph1, ph2] = new Array(4)
        .fill(null)
        .map(() => document.createElement("div"));
      const [p1S, p2S, p1T, p2T] = new Array(4)
        .fill(null)
        .map(() => document.createElement("span"));
      br(opening);
      br(opening);
      opening.append(ph1);
      br(opening);
      opening.append(p1);
      p1.append(p1S);
      p1.append(p1T);
      await ph1.Type("Player 1 Name:", 1);
      p1S.textContent = "> ";
      const nameMax = 10;
      function backSpace(e) {
        if (e.textContent.substring(0, e.textContent.length - 1).length >= 0)
          e.textContent = e.textContent.substring(0, e.textContent.length - 1);
      }
      function insertLetter(e, key) {
        if (e.textContent.length - 1 <= nameMax - 3)
          e.insertAdjacentText("beforeend", key);
      }
      const lAlphabet = new Array(26)
        .fill(null)
        .map((_, i) => String.fromCharCode(97 + i));
      const uAlphabet = new Array(26)
        .fill(null)
        .map((_, i) => String.fromCharCode(65 + i));
      const alphabet = [...lAlphabet, ...uAlphabet];
      const p1ID = p1T.falseInput(
        false,
        alphabet,
        (e) => {
          e.preventDefault();
          insertLetter(p1T, e.key.toLowerCase());
        },
        Symbol("type")
      );
      const p1ID2 = p1T.falseInput(
        false,
        ["Backspace"],
        (e) => {
          e.preventDefault();
          backSpace(p1T);
        },
        Symbol("del")
      );
      await p1S.select(selectTime, true, async () => {
        p1T.falseInput(true, null, null, p1ID);
        p1T.falseInput(true, null, null, p1ID2);
        p1S.textContent = "  ";
        br(opening);
        opening.append(ph2);
        br(opening);
        opening.append(p2);
        p2.append(p2S);
        p2.append(p2T);
        await ph2.Type("Player 2 Name:", 1);
        p2S.textContent = "> ";
      });
      const p2ID = p2T.falseInput(
        false,
        alphabet,
        (e) => {
          e.preventDefault();
          insertLetter(p2T, e.key.toLowerCase());
        },
        Symbol("type")
      );
      const p2ID2 = p2T.falseInput(
        false,
        ["Backspace"],
        (e) => {
          e.preventDefault();
          backSpace(p2T);
        },
        Symbol("del")
      );
      await p2S.select(selectTime, true, () => {
        p2T.falseInput(true, null, null, p2ID);
        p2T.falseInput(true, null, null, p2ID2);
        p2S.textContent = "  ";
      });
      self.players.l = p1T.textContent;
      self.players.r = p2T.textContent;
      br(opening);
      const play2 = document.createElement("div");
      opening.append(play2);
      await play2.Type("  Play", 1);
      await play2.select(selectTime, true, () => {
        opening.textContent = "";
        br(opening);
        self.openingFlag = true;
        self.Map();
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
let game = new Game(4, 5, document.querySelector("#pong"), 80, 5, 200, 5, 6);
