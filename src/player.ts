import Entity from "./entity";
import {
	Vector,
	__friction__,
	__gravity__,
	__jump__,
	__size__,
	__speed__
} from "./lib";
import Tile from "./tile";

export default class Player extends Entity {
	private static FRAMES = {
		idle: [0, 1],
		moving: [2, 1, 3, 1]
	};

	private vel: Vector = { x: 0, y: 0 };
	private grounded = false;
	private flip = false;
	private last = Date.now();
	private counter = 0;

	public constructor() {
		super({ x: 0, y: 0 }, { x: __size__ / 2, y: __size__ }, "assets/neo/0.png");
	}

	public move(left: boolean, right: boolean) {
		if (left) this.vel.x -= __speed__;
		if (right) this.vel.x += __speed__;
	}

	public jump() {
		if (!this.grounded) return;

		this.vel.y = __jump__;
	}

	public tick(tiles: Tile[], moving: boolean) {
		this.pos.x += this.vel.x;

		for (const tile of tiles) {
			if (this.checkCollision(tile)) {
				this.pos.x -=
					this.vel.x > 0
						? this.bounds.right - tile.bounds.left
						: this.bounds.left - tile.bounds.right;
				this.vel.x = 0;
			}
		}

		this.pos.y -= this.vel.y;

		this.grounded = false;

		for (const tile of tiles) {
			if (this.checkCollision(tile)) {
				this.pos.y -=
					this.vel.y > 0
						? this.bounds.top - tile.bounds.bottom
						: this.bounds.bottom - tile.bounds.top;
				this.vel.y = 0;
				this.grounded = this.pos.y < tile.getPosition.y;
			}
		}

		this.vel.x *= __friction__;
		this.vel.y -= __gravity__;

		if (this.vel.y + __gravity__ > 0)
			return (this.sprite.src = "assets/neo/4.png");
		if (this.vel.y + __gravity__ < 0)
			return (this.sprite.src = "assets/neo/5.png");

		if (this.counter >= (moving ? 4 : 2)) this.counter = 0;

		this.sprite.src = moving
			? `assets/neo/${Player.FRAMES.moving[this.counter]}.png`
			: `assets/neo/${Player.FRAMES.idle[this.counter]}.png`;

		if (Date.now() > this.last + (moving ? 100 : 200)) {
			this.counter++;
			this.last = Date.now();
		}
	}

	public draw(ctx: CanvasRenderingContext2D, cam: Vector) {
		if (this.flip) ctx.scale(-1, 1);
		ctx.drawImage(
			this.sprite,
			(this.pos.x + this.size.x * (this.flip ? 1 : -1) - cam.x) *
				(this.flip ? -1 : 1),
			this.pos.y - this.size.y / 2 - cam.y
		);
		if (this.flip) ctx.scale(-1, 1);
	}

	public setFlip(flip: boolean) {
		this.flip = flip;
	}
}
