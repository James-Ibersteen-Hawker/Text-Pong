class Game {
  res;
  maxScore;
  roundCount;
  bot;
  destination;
  constructor(res, maxScore, roundCount, bot, destination) {
    (this.res = res),
      (this.maxScore = maxScore),
      (this.roundCount = roundCount),
      (this.bot = bot),
      (this.scores = {
        score1: 0,
        score2: 0,
      }),
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
        e.forEach((a) => {
          self.destination.append(a);
        });
        self.destination.insertAdjacentHTML("beforeend", "<br>");
      });
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
    class Paddle {
      x;
      y;
      side;
      constructor(x, y, side) {
        (this.x = x), (this.y = y), (this.side = side), (this.d = undefined);
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
                    if (i < w * self.res - 1) arr.splice(i, 1, true);
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
            this.x += 1;
            break;
          case -1:
            this.x -= 1;
            break;
          case 2:
            this.y += 1;
            break;
          case -2:
            this.y -= 1;
            break;
        }
      }
    }
    const paddleHandler = {
      set(t, p, v) {
        if (!["x", "y"].includes(p)) return;
        else {
          const [oX, oY] = [t.x, t.y];
          self.grid[oY][oX] = self.base[oY][oX];
          let reflect = Reflect.set(t, p, v);
          if (t.sides[t.y][t.x] == true) {
            self.grid[t.y][t.x] = self.glyphs.controller;
            return reflect;
          } else {
            self.grid[oY][oX] = self.glyphs.controller;
            p == "x" ? (v = oX) : (v = oY);
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
    self.key = false;
    window.addEventListener(
      "keydown",
      (event) => {
        console.log(self.key);
        if (self.key == false) {
          self.key = true;
          switch (event.key) {
            case "w":
              self.lPaddle.move(-2);
              break;
            case "s":
              self.lPaddle.move(2);
              break;
            case "a":
              self.lPaddle.move(-1);
              break;
            case "d":
              self.lPaddle.move(1);
              break;
            case "ArrowUp":
              self.rPaddle.move(-2);
              break;
            case "ArrowDown":
              self.rPaddle.move(2);
              break;
            case "ArrowLeft":
              self.rPaddle.move(-1);
              break;
            case "ArrowRight":
              self.rPaddle.move(1);
              break;
          }
          self.key = false;
        } else return;
      },
      true
    );
  }
}

let game = new Game(2, 10, 5, false, document.querySelector("#testGrid"));
game.grid.render();
