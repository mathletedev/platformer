import Lava from "./lava";
import Mushroom from "./mushroom";
import Platform from "./platform";

export const __fps__ = 60;
export const __colors__ = {
	black: "#282c34",
	white: "#dcdfe4",
	red: "#e06c75",
	yellow: "#e5c07b",
	green: "#98c379",
	blue: "#61afef",
	magenta: "#c678dd"
};
export const __speed__ = 0.5;
export const __jump__ = 10;
export const __boost__ = 15;
export const __friction__ = 0.9;
export const __gravity__ = 0.5;
export const __follow__: Vector = { x: 0.05, y: 0.1 };
export const __size__ = 32;
export const __ground__ = -400;
export const __deadband__ = {
	horizontal: 0.3,
	vertical: 0.45
};
export const __animationSpeed__ = {
	idling: 200,
	moving: 100,
	blinking: 200,
	lava: 500,
	mushroom: 300,
	boost: 500
};
export const __reset__ = 1500;
export const __borders__: Record<string, number> = {
	"": 16,
	u: 15,
	d: 13,
	l: 12,
	r: 10,
	ud: 14,
	lr: 11,
	ul: 9,
	ur: 7,
	dl: 3,
	dr: 1,
	udl: 6,
	udr: 4,
	ulr: 8,
	dlr: 2,
	udlr: 5
};

export interface Vector {
	x: number;
	y: number;
}

export interface Environment {
	platforms: Platform[];
	lavas: Lava[];
	mushrooms: Mushroom[];
}
