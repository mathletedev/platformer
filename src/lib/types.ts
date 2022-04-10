import { Coin, Lava, Link, Mushroom, Platform } from "../entities";
import { Checkpoint } from "../entities/checkpoint";

export interface Environment {
	platforms: Platform[];
	coins: Coin[];
	lavas: Lava[];
	mushrooms: Mushroom[];
	links: Link[];
	checkpoints: Checkpoint[];
}
