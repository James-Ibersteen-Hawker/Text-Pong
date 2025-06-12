class Game {
  res;
  maxScore;
  roundCount;
  bot;
  constructor(res, maxScore, roundCount, bot) {
    (this.res = res),
      (this.maxScore = maxScore),
      (this.roundCount = roundCount),
      (this.bot = bot),
      (this.scores = {
        score1: 0,
        score2: 0,
      });
    (this.glyphs = {
      mid: "ǁ",
      tbEdge: "—",
      ball: "█",
      sides: "|",
      corner: "+",
      goal: `|--
             |
             |--`,
      controller: "0",
      fill: "a",
    }),
      (this.grid = []),
      (this.ref = []);
  }
  Map(loc) {
    const self = this;
    this.grid = Array.from({ length: 6 * this.res }, () => {
      let arr = new Array(5 * this.res * 2).fill(this.glyphs.fill);
      return new Proxy(arr, {
        set(t, p, r) {
          return Reflect.set(t, p, r);
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
    this.grid.render = function(loc) {
      this.forEach(e => {
        e.forEach(a => {
          loc.append(a);
        })
        loc.insertAdjacentHTML("beforeend", "<br>");
      })
    }
  }
}

let game = new Game(1, 10, 5, false);
game.Map();
game.grid.render(document.body)