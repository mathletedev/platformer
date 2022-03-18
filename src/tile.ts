import Entity from "./entity";
import { Vector, __size__ } from "./lib";

export default class Tile extends Entity {
	public constructor(pos: Vector, sprite: number) {
		super(pos, { x: __size__, y: __size__ }, `assets/tiles/${sprite}.png`);
	}
}