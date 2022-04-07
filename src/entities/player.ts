import {
	__animation__,
	__boost__,
	__friction__,
	__gravity__,
	__jump__,
	__reset__,
	__size__,
	__speed__
} from "../lib/constants";
import {Environment} from "../lib/types";
import Vector from "../lib/vector";
import {Entity} from "./entity";

export class Player extends Entity {
	private static FRAMES = {
		idle: [0, 1],
		moving: [2, 1, 3, 1]
	};
	private vel = Vector.ZERO;
	private grounded = false;
	private flip = false;
	public dead = false;
	private prev: Record<string, Entity | null> = {
		mushroom: null,
		link: null
	};

	public constructor() {
		super(Vector.ZERO, new Vector(__size__ / 2, __size__), "assets/neo/0.png");
	}

	public reset(start: Vector) {
		this.dead = true;

		setTimeout(() => {
			this.dead = false;
			this.pos = start;
			this.vel = Vector.ZERO;
		}, __reset__);
	}

	public move(left: boolean, right: boolean) {
		if (left) this.vel.x -= __speed__;
		if (right) this.vel.x += __speed__;
	}

	public jump() {
		if (this.grounded) this.vel.y = __jump__;
	}

	public tick(env: Environment, moving: boolean) {
		this.pos.x += this.vel.x;

		for (const platform of env.platforms) {
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

		for (const platform of env.platforms) {
			if (this.checkCollision(platform)) {
				this.pos.y -=
					this.vel.y > 0
						? this.bounds.top - platform.bounds.bottom
						: this.bounds.bottom - platform.bounds.top;
				this.vel.y = 0;
				this.grounded = this.pos.y < platform.getPosition().y;
			}
		}

		for (const coin of env.coins) {
			if (this.checkCollision(coin))
				env.coins.splice(env.coins.indexOf(coin), 1);
		}

		for (const lava of env.lavas) {
			if (this.checkCollision(lava)) return "reset";
		}

		for (const mushroom of env.mushrooms) {
			if (this.checkCollision(mushroom) && this.prev.mushroom !== mushroom) {
				mushroom.setSquished(true);
				setTimeout(() => {
					if (this.checkCollision(mushroom)) this.vel.y = __boost__;
					mushroom.setSquished(false);
				}, 500);

				this.prev.mushroom = mushroom;
				continue;
			}

			if (!this.checkCollision(mushroom) && this.prev.mushroom === mushroom)
				this.prev.mushroom = null;
		}

		for (const link of env.links) {
			if (this.checkCollision(link) && this.prev.link !== link) {
				link.open();

				this.prev.link = link;
				continue;
			}

			if (!this.checkCollision(link) && this.prev.link === link)
				this.prev.link = null;
		}

		this.vel.x *= __friction__;
		this.vel.y -= __gravity__;

		if (this.vel.y + __gravity__ > 0)
			return (this.sprite.src = "assets/neo/4.png");
		if (this.vel.y + __gravity__ < 0)
			return (this.sprite.src = "assets/neo/5.png");

		this.sprite.src = `assets/neo/${
			moving
				? Player.FRAMES.moving[Entity.getFrame(__animation__.moving, 4)]
				: Player.FRAMES.idle[Entity.getFrame(__animation__.idling, 2)]
		}.png`;
	}

	public draw(ctx: CanvasRenderingContext2D, cam: Vector) {
		if (
			this.dead &&
			Date.now() % (__animation__.blinking * 2) < __animation__.blinking
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

	private checkCollision(other: Entity) {
		return (
			this.bounds.left < other.bounds.right &&
			this.bounds.right > other.bounds.left &&
			this.bounds.top < other.bounds.bottom &&
			this.bounds.bottom > other.bounds.top
		);
	}

	public setPosition(pos: Vector) {
		this.pos = pos;
	}

	public setFlip(flip: boolean) {
		this.flip = flip;
	}
}
