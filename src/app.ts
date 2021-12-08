import GameEngine from "./engine";
import fixIt from "./systems/fix-it";
import fliper from "./systems/fliper";
import { gravity } from "./systems/gravity";
import keyboard from "./systems/keyboard";
import pieceGenerator from "./systems/piece-generator";
import restartTheGame from "./systems/restart-the-game";



const canvasElement = window.document.getElementById("screen") as HTMLCanvasElement;

const gameEngine = new GameEngine(canvasElement);


gameEngine.addSystem(gravity())
gameEngine.addSystem(fixIt())
gameEngine.addSystem(fliper())
gameEngine.addSystem(pieceGenerator())
gameEngine.addSystem(restartTheGame())
gameEngine.addSystem(keyboard())
gameEngine.addPiece(gameEngine.createRandomPiece())

gameEngine.start();