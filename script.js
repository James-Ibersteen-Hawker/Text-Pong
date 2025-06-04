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
      (this.grid = []);
  }
  init(width, height) {
    const self = this;
    this.grid.push(
      ...Array.from({ length: height }, () => {
        return new Proxy(new Array(width).fill(this.glyphs.fill), {
          set(t, p, r) {
            let reflect = Reflect.set(t, p, r);
            self.render();
            return reflect;
          },
        });
      })
    );
    this.render();
    this.grid[0][1] = "b";
  }
  render() {
    const cont = DOC.get("#testGrid");
    cont.textContent = "";
    this.grid.forEach((e) => {
      e.forEach((a) => {
        cont.insertAdjacentHTML("beforeend", a);
      });
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
game.init(10, 10);
