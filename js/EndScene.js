export default class EndScene extends Phaser.Scene {

	constructor() {
		super("EndScene");
	}

	create() {
		 var bg = this.add.sprite(0,0,'background_1');
		 bg.setOrigin(0,0);

		 var text = 'Game Over'

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