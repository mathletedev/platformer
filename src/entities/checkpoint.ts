import { __animation__ } from "../lib/constants";
import Vector from "../lib/vector";
import { Entity } from "./entity";

export class Checkpoint extends Entity {
	private active: boolean;

	public constructor(pos: Vector, active: boolean) {
		super(pos, Vector.UNIT, "assets/flag/0.png");

		this.active = active;
	}

	public tick() {
		this.sprite.src = `assets/flag/${
			Entity.getFrame(__animation__.flag, 4) * 2 + (this.active ? 0 : 1)
		}.png`;
	}

	public setActive(active: boolean) {
		this.active = active;
	}
}
