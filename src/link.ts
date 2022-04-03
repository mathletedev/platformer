import Entity from "./entity";
import { Vector, __size__ } from "./lib";

export default class Link extends Entity {
	private ogY: number;
	private url: string;

	public constructor(pos: Vector, url: string) {
		super(pos, { x: __size__, y: __size__ }, "assets/links/0.png");

		this.ogY = pos.y;
		this.url = url;
	}

	public tick() {
		this.pos = {
			x: this.pos.x,
			y: this.ogY + Math.sin(Date.now() * 0.01) * 4
		};
	}

	public open() {
		window.open(this.url);
	}
}
