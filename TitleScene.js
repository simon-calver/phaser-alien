export default class TitleScene extends Phaser.Scene {

  constructor() {
    super("TitleScene");
  }

  preload() {

  }

  create() {
    var bg = this.add.sprite(0, 0, 'background_1');
    bg.setOrigin(0, 0);

    var startText = this.add.text(100, 100, 'Start Game');
    startText.setInteractive({ useHandCursor: true });
    startText.on('pointerdown', () => this.startButton());

    var optionText = this.add.text(100, 200, 'Instructions');
    optionText.setInteractive({ useHandCursor: true });
    optionText.on('pointerdown', () => this.instructionButton());
  }

  startButton() {
    console.log("starting ...");
    this.scene.start('GameScene');
  }

  instructionButton() {
    console.log("instructions ...");
    this.scene.start('InstructionScene');
  }

}