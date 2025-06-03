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
  testGrid() {
    let width = 10;
    let height = 10;
    this.grid = Array.from({ length: height }, () =>
      new Array(width).fill(`<span>${this.glyphs.fill}</span>`)
    );
    let cont = DOC.get("#testGrid");
    this.grid.forEach((e) => {
      e.forEach((a) => cont.insertAdjacentHTML("beforeend", a));
      cont.insertAdjacentHTML("beforeend", "<br>");
    });
    this.grid = Array.from({ length: height }, () =>
      new Array(width).fill(this.glyphs.fill)
    );
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
      }
    });
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
game.testGrid();
