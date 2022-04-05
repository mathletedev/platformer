import Entity from "./entity";
import { Vector, __animation__, __size__ } from "./lib";

export default class Coin extends Entity {
	private og: number;

	public constructor(pos: Vector) {
		super(pos, { x: __size__, y: __size__ }, "assets/coin/0.png");

		this.og = pos.y;
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
}
