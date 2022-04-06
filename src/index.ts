import Game from "./game";
import map from "./lib/map.json";

const game = new Game();

game.loadMap(map);

game.play(true);
