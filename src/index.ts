import Game from "./game";
import map from "./map.json";

const game = new Game();

game.loadMap(map);

const loop = () => {
	requestAnimationFrame(loop);

	game.tick();
};

window.onload = () => requestAnimationFrame(loop);
