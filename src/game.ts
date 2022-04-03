import Lava from "./lava";
import {
	Environment,
	Vector,
	__borders__,
	__colors__,
	__deadband__,
	__follow__,
	__ground__,
	__size__
} from "./lib";
import Mushroom from "./mushroom";
import Platform from "./platform";
import Player from "./player";
import Text from "./text";

export default class Game {
	private run = false;
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
	private env: Environment = {
		platforms: [],
		lavas: [],
		mushrooms: []
	};
	private texts: Text[] = [
		new Text({ x: 0, y: 384 }, "MathleteDev", 64, __colors__.black)
	];

	public constructor() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		window.addEventListener("resize", () => {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		});

		document.addEventListener("keydown", (ev) => this.handleKey(ev, true));
		document.addEventListener("keyup", (ev) => this.handleKey(ev, false));
		document.addEventListener("touchstart", (ev) => {
			if (ev.touches[0].clientY < this.canvas.height * __deadband__.vertical)
				this.keys.jump = true;

			if (ev.touches[0].clientX < this.canvas.width * __deadband__.horizontal) {
				this.keys.left = true;
				return this.player.setFlip(true);
			}
			if (
				ev.touches[0].clientX >
				this.canvas.width * (1 - __deadband__.horizontal)
			) {
				this.keys.right = true;
				this.player.setFlip(false);
			}
		});
		document.addEventListener(
			"touchend",
			(_) => (this.keys = { left: false, right: false, jump: false })
		);
	}

	public play(run: boolean) {
		this.run = run;

		if (run) requestAnimationFrame(() => this.tick());
	}

	public tick() {
		if (this.run) requestAnimationFrame(() => this.tick());

		this.ctx.fillStyle = __colors__.blue;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		for (const lava of this.env.lavas) lava.tick();
		for (const mushroom of this.env.mushrooms) mushroom.tick();

		for (const type of Object.values(this.env)) {
			for (const entity of type) entity.draw(this.ctx, this.cam);
		}
		for (const text of this.texts) text.draw(this.ctx, this.cam);
		this.player.draw(this.ctx, this.cam);

		if (this.player.dead) return;

		this.player.move(this.keys.left, this.keys.right);
		if (this.keys.jump) this.player.jump();

		this.player.tick(this.env, this.keys.left || this.keys.right);

		const pos = this.player.getPosition();
		this.cam.x = Math.round(
			this.cam.x - (this.cam.x + this.canvas.width / 2 - pos.x) * __follow__.x
		);
		this.cam.y = Math.round(
			this.cam.y - (this.cam.y + this.canvas.height / 2 - pos.y) * __follow__.y
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

						this.env.platforms.push(
							new Platform(this.fromCoords(i, j, map), __borders__[borders] - 1)
						);
						break;
					case 2:
						this.env.lavas.push(new Lava(this.fromCoords(i, j, map)));
						break;
					case 3:
						this.env.mushrooms.push(new Mushroom(this.fromCoords(i, j, map)));
						break;
					case 4:
						const pos = this.fromCoords(i, j, map);

						this.player.setPosition(pos);
						this.cam = {
							x: pos.x - window.innerWidth / 2,
							y: pos.y - window.innerHeight / 2
						};
						break;
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
				this.keys.left = down;
				if (down) this.player.setFlip(true);
				break;
			case "ArrowRight":
			case "d":
				this.keys.right = down;
				if (down) this.player.setFlip(false);
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

	private fromCoords(i: number, j: number, map: number[][]): Vector {
		return {
			x: (j - (map[i].length - 1) / 2) * __size__,
			y: (i - (map.length - 1) / 2) * __size__
		};
	}

	private exists(map: number[][], i: number, j: number) {
		return (
			i >= 0 && j >= 0 && i < map.length && j < map[i].length && map[i][j] === 1
		);
	}
}
