import Entity from "./entity";
import { Vector, __animationSpeed__, __size__ } from "./lib";

export default class Mushroom extends Entity {
	private last = Date.now() + Math.random() * __animationSpeed__.mushroom;
	private frame = 0;
	private ogY: number;
	private squished = false;

	public constructor(pos: Vector) {
		super(pos, { x: __size__, y: __size__ }, `assets/mushroom/0.png`);

		this.ogY = pos.y;
	}

	public tick() {
		if (
			!this.squished &&
			Date.now() > this.last + __animationSpeed__.mushroom
		) {
			this.frame = this.frame === 0 ? 1 : 0;
			this.sprite.src = `assets/mushroom/${this.frame}.png`;
			this.last = Date.now() + Math.random() * __animationSpeed__.mushroom;
		}
	}

	public setSquished(squished: boolean) {
		this.squished = squished;
		this.sprite.src = `assets/mushroom/${squished ? 2 : 0}.png`;
		this.pos.y = squished ? this.ogY + __size__ * 0.1875 : this.ogY;
	}
}
