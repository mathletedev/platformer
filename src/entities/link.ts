import Vector from "../lib/vector";
import { Entity } from "./entity";

export class Link extends Entity {
	private og: number;
	private url: string;

	public constructor(pos: Vector, url: string) {
		super(pos, Vector.UNIT, "assets/links/0.png");

		this.og = pos.y;
		this.url = url;
	}

	public tick() {
		this.pos.y = this.og + Math.sin(Date.now() * 0.01) * 2;
	}

	public open() {
		window.open(this.url);
	}
}
