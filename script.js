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
    //grid generated

    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Proxy(this.grid[i], {
        get(t, p, r) {
          alert("here");
          return Reflect.get(t, p, r);
        },
        set(t, p, r) {
          return Reflect.set(t, p, r);
        },
      });
    }
    alert(this.grid[0][1]);
    this.grid = new Proxy(this.grid);
    alert("here");
    alert(this.grid[0]);
    // this.grid = new Proxy(this.grid, proxyController);
    // this.grid[0];
    // alert("here");
  }
  move(d) {
    switch (d) {
    }
  }
}
const DOC = {
  get(arg) {
    return document.querySelector(arg);
  },
};
let game = new Game(2, 5, 2, false);
game.testGrid(10, 10);
