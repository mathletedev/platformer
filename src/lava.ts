import Entity from "./entity";
import { Vector, __animationSpeed__, __size__ } from "./lib";

export default class Lava extends Entity {
	private last = Date.now();
	private frame = 0;

	public constructor(pos: Vector) {
		super(pos, { x: __size__, y: __size__ * 0.75 }, `assets/lava/0.png`);
	}

	public tick() {
		if (Date.now() > this.last + __animationSpeed__.lava) {
			this.frame = this.frame === 0 ? 1 : 0;
			this.sprite.src = `assets/lava/${this.frame}.png`;
			this.last = Date.now();
		}
	}
}
