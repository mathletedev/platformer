import Entity from "./entity";
import Lava from "./lava";
import {
	Vector,
	__animationSpeed__,
	__friction__,
	__gravity__,
	__jump__,
	__reset__,
	__size__,
	__speed__
} from "./lib";
import Platform from "./platform";

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
	public dead = false;

	public constructor() {
		super({ x: 0, y: 0 }, { x: __size__ / 2, y: __size__ }, "assets/neo/0.png");
	}

	public reset() {
		this.dead = true;

		setTimeout(() => {
			this.dead = false;
			this.pos = { x: 0, y: 0 };
		}, __reset__);
	}

	public move(left: boolean, right: boolean) {
		if (left) this.vel.x -= __speed__;
		if (right) this.vel.x += __speed__;
	}

	public jump() {
		if (this.grounded) this.vel.y = __jump__;
	}

	public tick(platforms: Platform[], lavas: Lava[], moving: boolean) {
		this.pos.x += this.vel.x;

		for (const platform of platforms) {
			if (this.checkCollision(platform)) {
				this.pos.x -=
					this.vel.x > 0
						? this.bounds.right - platform.bounds.left
						: this.bounds.left - platform.bounds.right;
				this.vel.x = 0;
			}
		}

		this.pos.y -= this.vel.y;

		this.grounded = false;

		for (const platform of platforms) {
			if (this.checkCollision(platform)) {
				this.pos.y -=
					this.vel.y > 0
						? this.bounds.top - platform.bounds.bottom
						: this.bounds.bottom - platform.bounds.top;
				this.vel.y = 0;
				this.grounded = this.pos.y < platform.getPosition().y;
			}
		}

		for (const lava of lavas) {
			if (this.checkCollision(lava)) return this.reset();
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

		if (
			Date.now() >
			this.last +
				(moving ? __animationSpeed__.moving : __animationSpeed__.idling)
		) {
			this.counter++;
			this.last = Date.now();
		}
	}

	public draw(ctx: CanvasRenderingContext2D, cam: Vector) {
		if (
			this.dead &&
			Date.now() % (__animationSpeed__.blinking * 2) <
				__animationSpeed__.blinking
		)
			return;

		if (this.flip) ctx.scale(-1, 1);
		ctx.drawImage(
			this.sprite,
			(this.pos.x + this.size.x * (this.flip ? 1 : -1) - cam.x) *
				(this.flip ? -1 : 1),
			this.pos.y - this.size.y / 2 - cam.y
		);
		if (this.flip) ctx.scale(-1, 1);
	}

	public setPosition(pos: Vector) {
		this.pos = pos;
	}

	public setFlip(flip: boolean) {
		this.flip = flip;
	}
}
