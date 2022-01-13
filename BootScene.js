export default class BootScene extends Phaser.Scene {

	constructor() {
		super('BootScene');
	}

	preload() {
		this.load.image('logo', 'images/tut/icon.png');
	}

	create() {
		this.scene.start("PreloadScene");
	}

}