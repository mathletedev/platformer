import Entity from "./entity";
import { Vector, __animation__, __size__ } from "./lib";

export default class Lava extends Entity {
	public constructor(pos: Vector) {
		super(pos, { x: __size__, y: __size__ * 0.75 }, `assets/lava/0.png`);
	}

	public tick() {
		this.sprite.src = `assets/lava/${Entity.getFrame(
			__animation__.lava,
			2
		)}.png`;
	}
}
