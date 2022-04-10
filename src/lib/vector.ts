import { __size__ } from "./constants";

export default class Vector {
	public static get ZERO() {
		return new Vector(0, 0);
	}
	public static get UNIT() {
		return new Vector(__size__, __size__);
	}

	public x: number;
	public y: number;

	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public round() {
		return new Vector(Math.round(this.x), Math.round(this.y));
	}
}
