
// import Phaser from 'phaser';

import BootScene from './BootScene.js';
import PreloadScene from './PreloadScene.js';
import TitleScene from './TitleScene.js';
import InstructionScene from './InstructionScene.js';
import GameScene from './GameScene.js';
import EndScene from './EndScene.js';
import Player from './player.js';

// Load our scenes
var bootScene = new BootScene();
var preloadScene = new PreloadScene();
var titleScene = new TitleScene();
var instructionScene = new InstructionScene();
var gameScene = new GameScene();
var endScene = new EndScene();


console.log("instructions ...");

//* Game scene */
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "matter",
    matter: {
      gravity: { y: 1 }, // This is the default value, so we could omit this

      // Enable debug graphics, so we can see the bounds of each physics 
      // object in our scene. Note: this can slow things down, so be sure 
      // to turn it off when you aren't debugging
      debug: true
    }
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin.default, // The plugin class
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision", // Where to store in the Scene, e.g. scene.matterCollision
      },
      {
        plugin: PhaserRaycaster,
        key: 'PhaserRaycaster',
        mapping: 'raycasterPlugin'
      }
    ],
  }
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