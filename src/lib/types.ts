import { Coin, Lava, Link, Mushroom, Platform } from "../entities";

export interface Environment {
	platforms: Platform[];
	coins: Coin[];
	lavas: Lava[];
	mushrooms: Mushroom[];
	links: Link[];
}
