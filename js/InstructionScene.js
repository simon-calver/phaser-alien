export default class InstructionScene extends Phaser.Scene {

	constructor() {
		super("InstructionScene");
	}

	preload() {

	}

	create() {
		 var bg = this.add.sprite(0,0,'background_1');
		 bg.setOrigin(0,0);

		 var text = 'Welcome to the game. Here are the instructions on how to'+
		 'play the game. Here you can explain various points of the game, display'+
		 'images etc.'

		 var startText = this.add.text(100,100, text);

		 // Add go back button to title screen
		var backText = this.add.text(100,500, 'Go Back');
		backText.setInteractive({ useHandCursor: true });
		backText.on('pointerdown', () => this.backButton());
		
	}

	backButton() {
		this.scene.start('TitleScene');
	}

}