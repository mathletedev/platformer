import Vector from "../lib/vector";

export class Entity {
	protected pos: Vector;
	protected size: Vector;
	protected sprite: HTMLImageElement = new Image();

	public constructor(pos: Vector, size: Vector, sprite: string) {
		this.pos = pos;
		this.size = size;
		this.sprite.src = sprite;
	}

	public draw(ctx: CanvasRenderingContext2D, cam: Vector) {
		ctx.drawImage(this.sprite, this.pos.x - cam.x, this.pos.y - cam.y);
	}

	public getPosition() {
		return this.pos;
	}

	public get bounds() {
		return {
			left: this.pos.x - this.size.x / 2,
			right: this.pos.x + this.size.x / 2,
			top: this.pos.y - this.size.y / 2,
			bottom: this.pos.y + this.size.y / 2
		};
	}

	public static getFrame(speed: number, total: number) {
		return Math.floor((Date.now() % (speed * total)) / speed);
	}
}
