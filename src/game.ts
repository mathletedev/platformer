import Lava from "./lava";
import {
  Vector,
  __borders__,
  __colors__,
  __follow__,
  __ground__,
  __size__,
} from "./lib";
import Platform from "./platform";
import Player from "./player";

export default class Game {
  private run = false;
  private canvas = document.querySelector("canvas") as HTMLCanvasElement;
  private ctx = this.canvas.getContext("2d")!;
  private keys = {
    left: false,
    right: false,
    jump: false,
  };
  private cam: Vector = {
    x: -window.innerWidth / 2,
    y: -window.innerHeight / 2,
  };
  private player = new Player();
  private platforms: Platform[] = [];
  private lavas: Lava[] = [];

  public constructor() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });

    document.addEventListener("keydown", (ev) => this.handleKey(ev, true));
    document.addEventListener("keyup", (ev) => this.handleKey(ev, false));
  }

  public play(run: boolean) {
    this.run = run;

    if (run) requestAnimationFrame(() => this.tick());
  }

  public tick() {
    if (this.run) requestAnimationFrame(() => this.tick());

    this.ctx.fillStyle = __colors__.blue;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const lava of this.lavas) {
      lava.tick();
      lava.draw(this.ctx, this.cam);
    }
    for (const platform of this.platforms) platform.draw(this.ctx, this.cam);
    this.player.draw(this.ctx, this.cam);

    if (this.player.dead) return;

    this.player.move(this.keys.left, this.keys.right);
    if (this.keys.jump) this.player.jump();

    this.player.tick(
      this.platforms,
      this.lavas,
      this.keys.left || this.keys.right
    );

    this.cam.x = Math.round(
      this.cam.x -
        (this.cam.x + this.canvas.width / 2 - this.player.getPosition.x) *
          __follow__.x
    );
    this.cam.y = Math.round(
      this.cam.y -
        (this.cam.y + this.canvas.height / 2 - this.player.getPosition.y) *
          __follow__.y
    );

    if (this.cam.y > __ground__) this.cam.y = __ground__;
  }

  public loadMap(map: number[][]) {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === 0) continue;

        switch (map[i][j]) {
          case 0:
            continue;
          case 1:
            let borders = "";
            if (this.exists(map, i - 1, j)) borders += "u";
            if (this.exists(map, i + 1, j)) borders += "d";
            if (this.exists(map, i, j - 1)) borders += "l";
            if (this.exists(map, i, j + 1)) borders += "r";

            this.platforms.push(
              new Platform(
                {
                  x: (j - (map[i].length - 1) / 2) * __size__,
                  y: (i - (map.length - 1) / 2) * __size__,
                },
                __borders__[borders] - 1
              )
            );

            break;
          case 2:
            this.lavas.push(
              new Lava({
                x: (j - (map[i].length - 1) / 2) * __size__,
                y: (i - (map.length - 1) / 2) * __size__,
              })
            );
        }
      }
    }
  }

  private handleKey(ev: KeyboardEvent, down: boolean) {
    switch (ev.key) {
      default:
        return;
      case "ArrowLeft":
      case "a":
        if (down) this.player.setFlip(true);
        this.keys.left = down;
        break;
      case "ArrowRight":
      case "d":
        if (down) this.player.setFlip(false);
        this.keys.right = down;
        break;
      case "ArrowUp":
      case "w":
      case " ":
        this.keys.jump = down;
        break;
      case "p":
        if (down) this.play(!this.run);
        break;
      case "o":
        if (down) this.player.reset();
        break;
    }

    ev.preventDefault();
  }

  private exists(map: number[][], i: number, j: number) {
    return (
      i >= 0 && j >= 0 && i < map.length && j < map[i].length && map[i][j] === 1
    );
  }
}
