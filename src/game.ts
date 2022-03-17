import { Vector, __colors__, __follow__, __ground__, __size__ } from "./lib";
import Player from "./player";
import Tile from "./tile";

export default class Game {
	private canvas = document.querySelector("canvas") as HTMLCanvasElement;
	private ctx = this.canvas.getContext("2d")!;
	private keys = {
		left: false,
		right: false,
		jump: false
	};
	private cam: Vector = {
		x: -window.innerWidth / 2,
		y: -window.innerHeight / 2
	};
	private player = new Player();
	private tiles: Tile[] = [];

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

	public tick() {
		this.ctx.fillStyle = __colors__.blue;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.player.move(this.keys.left, this.keys.right);
		if (this.keys.jump) this.player.jump();

		for (const tile of this.tiles) tile.draw(this.ctx, this.cam);

		this.player.tick(this.tiles, this.keys.left || this.keys.right);

		this.player.draw(this.ctx, this.cam);

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

				let borders = "";
				if (this.exists(map, i - 1, j)) borders += "u";
				if (this.exists(map, i + 1, j)) borders += "d";
				if (this.exists(map, i, j - 1)) borders += "l";
				if (this.exists(map, i, j + 1)) borders += "r";

				let sprite = 0;
				switch (borders) {
					case "":
						sprite = 16;
						break;
					case "u":
						sprite = 15;
						break;
					case "d":
						sprite = 13;
						break;
					case "l":
						sprite = 12;
						break;
					case "r":
						sprite = 10;
						break;
					case "ud":
						sprite = 14;
						break;
					case "lr":
						sprite = 11;
						break;
					case "ul":
						sprite = 9;
						break;
					case "ur":
						sprite = 7;
						break;
					case "dl":
						sprite = 3;
						break;
					case "dr":
						sprite = 1;
						break;
					case "udl":
						sprite = 6;
						break;
					case "udr":
						sprite = 4;
						break;
					case "ulr":
						sprite = 8;
						break;
					case "dlr":
						sprite = 2;
						break;
					case "udlr":
						sprite = 5;
						break;
				}

				this.tiles.push(
					new Tile(
						{
							x: (j - (map[i].length - 1) / 2) * __size__,
							y: (i - (map.length - 1) / 2) * __size__
						},
						sprite - 1
					)
				);
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
		}

		ev.preventDefault();
	}

	private exists(map: number[][], i: number, j: number) {
		return (
			i >= 0 && j >= 0 && i < map.length && j < map[i].length && map[i][j] === 1
		);
	}
}
