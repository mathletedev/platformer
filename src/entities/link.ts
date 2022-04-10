import { __animation__ } from "../lib/constants";
import Vector from "../lib/vector";
import { Entity } from "./entity";

export class Link extends Entity {
	private og: number;
	private url: string;

	public constructor(pos: Vector, url: string) {
		super(pos, Vector.UNIT, "assets/coin/0.png");

		this.og = pos.y;
		this.url = url;
	}

	public tick() {
		this.pos.y = this.og + Math.sin(Date.now() * 0.01) * 2;

		this.sprite.src = `assets/coin/${Entity.getFrame(
			__animation__.coin,
			6
		)}.png`;
	}

	public open() {
		window.open(this.url);
	}
}
