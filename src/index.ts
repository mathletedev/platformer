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

let canvas = document.querySelector("canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d")!;
let run = false;
let keys = {
	left: false,
	right: false,
	jump: false
};
let cam = new Vector(-window.innerWidth / 2, -window.innerHeight / 2);
let player = new Player(Vector.ZERO);
let level = 0;
let next = false;
let env: Environment = {
	platforms: [],
	coins: [],
	lavas: [],
	mushrooms: [],
	links: [],
	checkpoints: [],
	portal: null
};
let texts: Text[] = [];
let coins = 0;
let alpha = 1;
let fade = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

document.addEventListener("keydown", (ev) => handleKey(ev, true));
document.addEventListener("keyup", (ev) => handleKey(ev, false));
document.addEventListener("touchstart", (ev) => {
	if (player.dead) return;

	if (ev.touches[0].clientY < canvas.height * __deadband__.vertical)
		keys.jump = true;
	if (ev.touches[0].clientX < canvas.width * __deadband__.horizontal) {
		keys.left = true;
		return player.setFlip(true);
	}
	if (ev.touches[0].clientX > canvas.width * (1 - __deadband__.horizontal)) {
		keys.right = true;
		player.setFlip(false);
	}
});
document.addEventListener(
	"touchend",
	(_) => (keys = { left: false, right: false, jump: false })
);

const play = (_run: boolean) => {
	run = _run;

	if (run) requestAnimationFrame(() => tick());
};

const reset = () => {
	keys = {
		left: false,
		right: false,
		jump: false
	};

	player.reset();
};

const tick = () => {
	if (run) requestAnimationFrame(() => tick());

	if (next && alpha >= 1) {
		next = false;
		return loadMap(level + 1);
	}

	if (player.top - cam.y > canvas.height && !next) player.respawn();

	ctx.fillStyle = __colors__.blue;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (const type of Object.values(env)) {
		if (!(type instanceof Array)) continue;
		for (const entity of type) {
			if (!!entity.tick) entity.tick();
			entity.draw(ctx, cam);
		}
	}

	if (env.coins.length === 0) {
		env.portal?.tick();
		env.portal?.draw(ctx, cam);
	}

	for (const text of texts) text.draw(ctx, cam);

	player.draw(ctx, cam);

	let coin = new Image();
	coin.src = `assets/coin/${Entity.getFrame(__animation__.coin, 6)}.png`;

	ctx.drawImage(coin, 20, 20);

	ctx.fillStyle = __colors__.black;
	ctx.font = "24px Cascadia Code";
	ctx.fillText(`${coins - env.coins.length}/${coins}`, 55, 44);

	if (player.dead) return;

	player.move(keys.left, keys.right);
	if (keys.jump) player.jump();

	switch (player.tick(env, keys.left || keys.right)) {
		case "success":
			if (env.coins.length > 0) break;
			fade = true;
			next = true;
			break;
		case "reset":
			if (next) break;
			reset();
			break;
	}

	const pos = player.getPosition();
	cam.x -= (cam.x + canvas.width / 2 - pos.x) * __follow__.x;
	cam.y -= (cam.y + canvas.height / 2 - pos.y) * __follow__.y;

	cam = cam.round();
	if (cam.y > __ground__) cam.y = __ground__;

	if (fade && alpha < 1) alpha += __animation__.fade;
	else if (!fade && alpha > 0) alpha -= __animation__.fade;

	if (!alpha) return;

	ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const loadMap = (_level: number) => {
	level = _level;
	fade = false;

	const {
		map,
		texts: _texts
	}: { map: number[][]; texts: any[][] } = require(`./levels/${level}.json`);

	env = {
		platforms: [],
		coins: [],
		lavas: [],
		checkpoints: [],
		mushrooms: [],
		links: [],
		portal: null
	};
	texts = [];

	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[i].length; j++) {
			if (map[i][j] === 0) continue;

			switch (map[i][j]) {
				case 0:
					continue;
				case 1:
					let borders = "";
					if (exists(map, i - 1, j)) borders += "u";
					if (exists(map, i + 1, j)) borders += "d";
					if (exists(map, i, j - 1)) borders += "l";
					if (exists(map, i, j + 1)) borders += "r";

					env.platforms.push(
						new Platform(fromCoords(i, j, map), __borders__[borders] - 1)
					);
					break;
				case 2:
					env.coins.push(new Coin(fromCoords(i, j, map)));
					break;
				case 3:
					env.lavas.push(new Lava(fromCoords(i, j, map)));
					break;
				case 4:
					const start = fromCoords(i, j, map);

					player = new Player(start);
					cam.x = start.x - window.innerWidth / 2;
					cam.y = start.y - window.innerHeight / 2;

					env.checkpoints.push(new Checkpoint(start, true));
					break;
				case 5:
					env.mushrooms.push(new Mushroom(fromCoords(i, j, map)));
					break;
				case 6:
					env.links.push(
						new Link(
							fromCoords(i, j, map),
							"https://www.youtube.com/watch?v=dQw4w9WgXcQ"
						)
					);
					break;
				case 7:
					env.checkpoints.push(new Checkpoint(fromCoords(i, j, map), false));
					break;
				case 8:
					env.portal = new Portal(fromCoords(i, j, map));
					break;
			}
		}
	}

	for (const text of _texts)
		texts.push(
			new Text(new Vector(text[1], text[2]), text[0], 32, __colors__.black)
		);

	coins = env.coins.length;
};

const handleKey = (ev: KeyboardEvent, down: boolean) => {
	if (player.dead) return;

	switch (ev.key) {
		default:
			return;
		case "ArrowLeft":
		case "a":
			keys.left = down;
			if (down) player.setFlip(true);
			break;
		case "ArrowRight":
		case "d":
			keys.right = down;
			if (down) player.setFlip(false);
			break;
		case "ArrowUp":
		case "w":
		case " ":
			keys.jump = down;
			break;
		case "p":
			if (down) play(!run);
			break;
		case "o":
			if (down) reset();
			break;
	}

	ev.preventDefault();
};

const fromCoords = (i: number, j: number, map: number[][]): Vector => {
	return new Vector(
		(j - (map[i].length - 1) / 2) * __size__,
		(i - (map.length - 1) / 2) * __size__
	);
};

const exists = (map: number[][], i: number, j: number) => {
	return (
		i >= 0 && j >= 0 && i < map.length && j < map[i].length && map[i][j] === 1
	);
};

loadMap(0);
play(true);
