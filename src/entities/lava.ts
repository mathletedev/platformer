import { __animation__, __size__ } from "../lib/constants";
import Vector from "../lib/vector";
import { Entity } from "./entity";

export class Lava extends Entity {
	public constructor(pos: Vector) {
		super(pos, new Vector(__size__, __size__ * 0.75), `assets/lava/0.png`);
	}

	public tick() {
		this.sprite.src = `assets/lava/${Entity.getFrame(
			__animation__.lava,
			2
		)}.png`;
	}
}
