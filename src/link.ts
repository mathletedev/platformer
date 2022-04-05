import Entity from "./entity";
import { Vector, __animation__, __size__ } from "./lib";

export default class Link extends Entity {
	private og: number;
	private url: string;

	public constructor(pos: Vector, url: string) {
		super(pos, { x: __size__, y: __size__ }, "assets/coin/0.png");

		this.og = pos.y;
		this.url = url;
	}

	public tick() {
		this.pos = {
			x: this.pos.x,
			y: this.og + Math.sin(Date.now() * 0.01) * 2
		};

		this.sprite.src = `assets/coin/${Entity.getFrame(
			__animation__.coin,
			6
		)}.png`;
	}

	public open() {
		window.open(this.url);
	}
}
