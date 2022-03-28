import Game from "./game";
import map from "./map.json";

const game = new Game();

game.loadMap(map);

game.play(true);
