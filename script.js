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
    this.glyphs = {
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
    };
  }
  testGrid(width, height) {
    const cont = DOC.get("#testGrid");
    this.grid = Array.from({ length: height }, () =>
      new Array(width).fill(this.glyphs.fill)
    );
    this.grid.forEach((e) => {
      e.forEach((a) => cont.insertAdjacentHTML("beforeend", a));
      cont.insertAdjacentHTML("beforeend", "<br>");
    });
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Proxy(this.grid[i], {
        get(t, p, r) {
          console.log("got subarray", t, p, r);
          return Reflect.get(t, p, r);
        },
        set(t, p, r) {
          console.log("set subarray", t, p, r);
          return Reflect.set(t, p, r);
        },
      });
    }
    this.grid = new Proxy(this.grid, {
      get(t, p, r) {
        console.log("got lobby", t, p, r);
        return Reflect.get(t, p, r);
      },
      set(t, p, r) {
        console.log("set lobby", t, p, r);
        return Reflect.set(t, p, r);
      },
    });
    this.grid[0][1] = 2;
  }
}
const DOC = {
  get(arg) {
    return document.querySelector(arg);
  },
};
let game = new Game(2, 5, 2, false);
game.testGrid(10, 10);
