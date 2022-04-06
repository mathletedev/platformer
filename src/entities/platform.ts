import Vector from "../lib/vector";
import { Entity } from "./entity";

export class Platform extends Entity {
	public constructor(pos: Vector, sprite: number) {
		super(pos, Vector.UNIT, `assets/platforms/${sprite}.png`);
	}
}
