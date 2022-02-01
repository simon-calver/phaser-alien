export default class PreloadScene extends Phaser.Scene {

  constructor() {
    super('PreloadScene');
  }

  preload() {

    // Add loading screen bars
    this.graphics = this.add.graphics();
    this.newGraphics = this.add.graphics();
    var progressBar = new Phaser.Geom.Rectangle(200, 200, 400, 50);
    var progressBarFill = new Phaser.Geom.Rectangle(205, 205, 290, 40);

    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillRectShape(progressBar);

    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(progressBarFill);

    var loadingText = this.add.text(250, 260, "Loading: ", { fontSize: '32px', fill: '#FFF' });


    this.load.on('progress', this.updateBar, { newGraphics: this.newGraphics, loadingText: loadingText });
    this.load.on('complete', this.complete, { scene: this.scene });

    // Any Assets you want to load in
    // this.load.image('background', 'phaser-alien/assets/background.png');
    for (var i = 0; i < 30; i++) {
      this.load.image('background_' + i, 'images/tut/background.png');
    }

    this.load.json('tiledMapJson', 'phaser-alien/assets/tilemaps/alien.json');
    this.load.spritesheet('assistant', 'phaser-alien/assets/sprites/player/$Dr Frankenstien2.png', { frameWidth: 24, frameHeight: 32 });


    this.load.image('background', 'phaser-alien/assets/stars.png');
    // this.load.image('bridge-upper', 'phaser-alien/assets/bridge-upper.png');


    // Load sprite sheet generated with TexturePacker
    this.load.atlas('bridge-parts', 'phaser-alien/assets/bridge-parts.png', 'phaser-alien/assets/bridge-parts.json');

    // Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('bridge-shapes', 'phaser-alien/assets/bridge-shapes.json');


  }

  updateBar(percentage) {
    if (this.newGraphics) {
      this.newGraphics.clear();
      this.newGraphics.fillStyle(0x3587e2, 1);
      this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(205, 205, percentage * 390, 40));
    }
    percentage = percentage * 100;
    this.loadingText.setText("Loading: " + percentage.toFixed(2) + "%");
    // console.log("P:" + percentage);
  }

  complete() {
    console.log("COMPLETE!");
    this.scene.start('GameScene');
    // this.scene.start("TitleScene");
  }

  create() {

  }

}