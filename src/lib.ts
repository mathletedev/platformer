export const __fps__ = 60;
export const __colors__ = {
  black: "#282c34",
  white: "#dcdfe4",
  red: "#e06c75",
  yellow: "#e5c07b",
  green: "#98c379",
  blue: "#61afef",
  magenta: "#c678dd",
};
export const __speed__ = 0.5;
export const __jump__ = 10;
export const __friction__ = 0.9;
export const __gravity__ = 0.5;
export const __follow__: Vector = { x: 0.05, y: 0.1 };
export const __size__ = 32;
export const __ground__ = -400;
export const __animationSpeed__ = {
  idling: 200,
  moving: 100,
  blinking: 200,
};
export const __reset__ = 1500;

export interface Vector {
  x: number;
  y: number;
}
