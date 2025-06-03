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
    };
  }
  testGrid() {
    let width = 10;
    let height = 10;
    this.grid = Array.from({ length: height }, (_, i) =>
      new Array(width).fill(" ")
    );
    let cont = DOC.get("#testGrid");
    alert(this.grid);
    this.grid.forEach((e) => {
      e.forEach((a) => cont.append("a"));
      cont.insertAdjacentHTML("beforeend", "<br>");
    });
  }
}

const DOC = {
  get(arg) {
    return document.querySelector(arg);
  },
};

let game = new Game(2, 5, 2, false);
game.testGrid();
alert("here");
