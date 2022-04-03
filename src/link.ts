import Entity from "./entity";
import { Vector, __size__ } from "./lib";

export default class Link extends Entity {
	private url: string;

	public constructor(pos: Vector, url: string) {
		super(pos, { x: __size__, y: __size__ }, "assets/links/0.png");

		this.url = url;
	}

	public open() {
		window.open(this.url);
	}
}
