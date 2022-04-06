import { __animation__, __size__ } from "../lib/constants";
import Vector from "../lib/vector";
import { Entity } from "./entity";

export class Mushroom extends Entity {
	private last = Date.now() + Math.random() * __animation__.mushroom;
	private frame = 0;
	private og: number;
	private squished = false;

	public constructor(pos: Vector) {
		super(pos, Vector.UNIT, `assets/mushroom/0.png`);

		this.og = pos.y;
	}

	public tick() {
		if (!this.squished && Date.now() > this.last + __animation__.mushroom) {
			this.frame = this.frame === 0 ? 1 : 0;
			this.sprite.src = `assets/mushroom/${this.frame}.png`;
			this.last = Date.now() + Math.random() * __animation__.mushroom;
		}
	}

	public setSquished(squished: boolean) {
		this.squished = squished;
		this.sprite.src = `assets/mushroom/${squished ? 2 : 0}.png`;
		this.pos.y = squished ? this.og + __size__ * 0.1875 : this.og;
	}
}
