import BootScene from './BootScene.js';
import PreloadScene from './PreloadScene.js';
import TitleScene from './TitleScene.js';
import InstructionScene from './InstructionScene.js';
import GameScene from './GameScene.js';
import EndScene from './EndScene.js';

// Load our scenes
var bootScene = new BootScene();
var preloadScene = new PreloadScene();
var titleScene = new TitleScene();
var instructionScene = new InstructionScene();
var gameScene = new GameScene();
var endScene = new EndScene();




//* Game scene */
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
};
var game = new Phaser.Game(config);

// load scenes
game.scene.add('BootScene', bootScene);
game.scene.add('PreloadScene', preloadScene);
game.scene.add('TitleScene', titleScene);
game.scene.add('InstructionScene', instructionScene);
game.scene.add("GameScene", gameScene);
game.scene.add("EndScene", endScene);


// start title
game.scene.start('BootScene');