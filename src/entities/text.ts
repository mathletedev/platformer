import Vector from "../lib/vector";

export class Text {
	private pos: Vector;
	private text: string;
	private size: number;
	private color: string;

	public constructor(pos: Vector, text: string, size: number, color: string) {
		this.pos = pos;
		this.text = text;
		this.size = size;
		this.color = color;
	}

	public draw(ctx: CanvasRenderingContext2D, cam: Vector) {
		ctx.fillStyle = this.color;
		ctx.font = `${this.size}px Cascadia Code`;

		const size = ctx.measureText(this.text);
		ctx.fillText(
			this.text,
			this.pos.x - size.width / 2 - cam.x,
			this.pos.y - this.size / 2 - cam.y
		);
	}
}
