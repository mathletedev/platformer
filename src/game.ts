import {
	Coin,
	Entity,
	Lava,
	Link,
	Mushroom,
	Platform,
	Player,
	Portal,
	Text
} from "./entities";
import { Checkpoint } from "./entities/checkpoint";
import {
	__animation__,
	__borders__,
	__colors__,
	__deadband__,
	__follow__,
	__ground__,
	__size__
} from "./lib/constants";
import { Environment } from "./lib/types";
import Vector from "./lib/vector";

export default class Game {
	private run = false;
	private canvas = document.querySelector("canvas") as HTMLCanvasElement;
	private ctx = this.canvas.getContext("2d")!;
	private keys = {
		left: false,
		right: false,
		jump: false
	};
	private cam = new Vector(-window.innerWidth / 2, -window.innerHeight / 2);
	private player = new Player(Vector.ZERO);
	private level = 0;
	private next = false;
	private env: Environment = {
		platforms: [],
		coins: [],
		lavas: [],
		mushrooms: [],
		links: [],
		checkpoints: [],
		portal: null
	};
	private texts: Text[] = [];
	private coins = 0;
	private alpha = 1;
	private fade = false;

	public constructor() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.ctx.fillStyle = "#000000";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		window.addEventListener("resize", () => {
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		});

		document.addEventListener("keydown", (ev) => this.handleKey(ev, true));
		document.addEventListener("keyup", (ev) => this.handleKey(ev, false));
		document.addEventListener("touchstart", (ev) => {
			if (this.player.dead) return;

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

	public reset() {
		this.keys = {
			left: false,
			right: false,
			jump: false
		};

		this.player.reset();
	}

	public tick() {
		if (this.run) requestAnimationFrame(() => this.tick());

		if (this.next && this.alpha >= 1) {
			this.next = false;
			return this.loadMap(this.level + 1);
		}

		if (this.player.top - this.cam.y > this.canvas.height && !this.next)
			this.player.respawn();

		this.ctx.fillStyle = __colors__.blue;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		for (const type of Object.values(this.env)) {
			if (!(type instanceof Array)) continue;
			for (const entity of type) {
				if (!!entity.tick) entity.tick();
				entity.draw(this.ctx, this.cam);
			}
		}

		if (this.env.coins.length === 0) {
			this.env.portal?.tick();
			this.env.portal?.draw(this.ctx, this.cam);
		}

		for (const text of this.texts) text.draw(this.ctx, this.cam);

		this.player.draw(this.ctx, this.cam);

		let coin = new Image();
		coin.src = `assets/coin/${Entity.getFrame(__animation__.coin, 6)}.png`;

		this.ctx.drawImage(coin, 20, 20);

		this.ctx.fillStyle = __colors__.black;
		this.ctx.font = "24px Cascadia Code";
		this.ctx.fillText(
			`${this.coins - this.env.coins.length}/${this.coins}`,
			55,
			44
		);

		if (this.player.dead) return;

		this.player.move(this.keys.left, this.keys.right);
		if (this.keys.jump) this.player.jump();

		switch (this.player.tick(this.env, this.keys.left || this.keys.right)) {
			case "success":
				if (this.env.coins.length > 0) break;
				this.fade = true;
				this.next = true;
				break;
			case "reset":
				if (this.next) break;
				this.reset();
				break;
		}

		const pos = this.player.getPosition();
		this.cam.x -= (this.cam.x + this.canvas.width / 2 - pos.x) * __follow__.x;
		this.cam.y -= (this.cam.y + this.canvas.height / 2 - pos.y) * __follow__.y;

		this.cam = this.cam.round();
		if (this.cam.y > __ground__) this.cam.y = __ground__;

		if (this.fade && this.alpha < 1) this.alpha += __animation__.fade;
		else if (!this.fade && this.alpha > 0) this.alpha -= __animation__.fade;

		if (!this.alpha) return;

		this.ctx.fillStyle = `rgba(0, 0, 0, ${this.alpha})`;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	public loadMap(level: number) {
		this.level = level;
		this.fade = false;

		const {
			map,
			texts
		}: { map: number[][]; texts: any[][] } = require(`./levels/${level}.json`);

		this.env = {
			platforms: [],
			coins: [],
			lavas: [],
			checkpoints: [],
			mushrooms: [],
			links: [],
			portal: null
		};
		this.texts = [];

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
						this.env.coins.push(new Coin(this.fromCoords(i, j, map)));
						break;
					case 3:
						this.env.lavas.push(new Lava(this.fromCoords(i, j, map)));
						break;
					case 4:
						const start = this.fromCoords(i, j, map);

						this.player = new Player(start);
						this.cam.x = start.x - window.innerWidth / 2;
						this.cam.y = start.y - window.innerHeight / 2;

						this.env.checkpoints.push(new Checkpoint(start, true));
						break;
					case 5:
						this.env.mushrooms.push(new Mushroom(this.fromCoords(i, j, map)));
						break;
					case 6:
						this.env.links.push(
							new Link(
								this.fromCoords(i, j, map),
								"https://www.youtube.com/watch?v=dQw4w9WgXcQ"
							)
						);
						break;
					case 7:
						this.env.checkpoints.push(
							new Checkpoint(this.fromCoords(i, j, map), false)
						);
						break;
					case 8:
						this.env.portal = new Portal(this.fromCoords(i, j, map));
						break;
				}
			}
		}

		for (const text of texts)
			this.texts.push(
				new Text(new Vector(text[1], text[2]), text[0], 32, __colors__.black)
			);

		this.coins = this.env.coins.length;
	}

	private handleKey(ev: KeyboardEvent, down: boolean) {
		if (this.player.dead) return;

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
				if (down) this.reset();
				break;
		}

		ev.preventDefault();
	}

	private fromCoords(i: number, j: number, map: number[][]): Vector {
		return new Vector(
			(j - (map[i].length - 1) / 2) * __size__,
			(i - (map.length - 1) / 2) * __size__
		);
	}

	private exists(map: number[][], i: number, j: number) {
		return (
			i >= 0 && j >= 0 && i < map.length && j < map[i].length && map[i][j] === 1
		);
	}
}
