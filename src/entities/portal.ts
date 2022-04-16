import { __animation__, __size__ } from "../lib/constants";
import Vector from "../lib/vector";
import { Entity } from "./entity";

export class Portal extends Entity {
	public constructor(pos: Vector) {
		super(
			new Vector(pos.x, pos.y - __size__ / 8),
			new Vector(__size__ / 2, __size__),
			"assets/portal/0.png"
		);
	}

	public tick() {
		this.sprite.src = `assets/portal/${Entity.getFrame(
			__animation__.portal,
			4
		)}.png`;
	}
}
