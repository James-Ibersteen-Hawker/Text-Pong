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
      this.destination = destination,
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
    let w = 5, h = 6;
    if (h % 2 == 1) h += 1;
    this.grid = Array.from({ length: h * this.res + 2 }, () => {
      let arr = new Array(w * this.res * 2 + 1).fill(this.glyphs.fill);
      return new Proxy(arr, {
        set(t, p, r) {
          let reflect = Reflect.set(t, p, r);
          self.grid.render()
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
    this.grid.render = function() {
      self.destination.innerHTML = "";
      this.forEach(e => {
        e.forEach(a => {
          self.destination.append(a);
        })
        self.destination.insertAdjacentHTML("beforeend", "<br>");
      })
    };
    this.grid[0].fill(this.glyphs.tbEdge);
    this.grid.at(-1).fill(this.glyphs.tbEdge)
    this.grid.forEach(e => {
      e.forEach((_,i) => {
        if (i == w * self.res + 1) e.splice(i, 0,self.glyphs.mid);
        else if (i == 0) e.splice(i,1, this.glyphs.sides);
      })
      e.push(self.glyphs.sides)
    })
    this.grid[(h * self.res) / 2][0] = self.glyphs.goalL;
    this.grid[(h * self.res) / 2 + 1][0] = self.glyphs.goalL;
    this.grid[(h * self.res) / 2][this.grid[1].length - 1] = self.glyphs.goalR;
    this.grid[(h * self.res) / 2 + 1][this.grid[1].length - 1] = self.glyphs.goalR;
    this.base = Array.from({length: this.grid.length}, (_,i) => {
      return new Proxy([...this.grid[i].self], {
        set(t,p,r) {
          throw new Error("Blocked modification of base");
          return;
        },
        get(t,p,r) {
          return Reflect.get(t,p,r);
        }
      });
    })
  }
}

let game = new Game(2, 10, 5, false,document.querySelector("#testGrid"));
game.grid.render()