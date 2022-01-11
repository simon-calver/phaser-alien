export default class GameScene extends Phaser.Scene {

	constructor() {
		super("GameScene");
	}

	init() {
		// game variables
		this.score = 0;
		this.lives = 3;
		this.speed= 1.5;
		this.dragon_move = 1;
		this.score_text;
		this.lives_text;
	};

	preload() {
		// lets preload some images that we can use in our game (add these to the preloader)
		this.load.image('background', 'images/tut/background.png');
		this.load.image('player', 'images/tut/warrior.png');
		this.load.image('dragon', 'images/tut/pet_dragon_new.png');
		this.load.image('gold', 'images/tut/icon.png');
	}

	create() {
	   // add the background
	   var bg = this.add.sprite(0, 0, 'background');
	   bg.setOrigin(0,0);

	   // add score text & game text to screen
	   this.scoreText = this.add.text(100, 16, 'score: ' + this.score, { fontSize: '32px', fill: '#000' });
	   this.liveText = this.add.text(16, this.sys.game.config.height-50, 'Lives: ' + this.lives, {fontSize: '32px', fill: '#000'});

	   // add player
	   this.player = this.add.sprite(100, 150, 'player');
    this.player.setScale(0.3);
    
	   // add monster
	   this.dragon = this.add.sprite(350, 150, 'dragon');
	   this.dragon.setScale(0.1);

	   // add gold
	   this.gold = this.add.sprite(650, 150, 'gold');
	   this.gold.setScale(0.5);

	}

	update() {

	  // Is mouse click down?
	  if (this.input.activePointer.isDown) {
	  	// move player along the x-axis at a rate this.speed pixels
	    this.player.x += this.speed;
	  }


	  if(this.dragon.y >= 500) {
	  	// Enemy movement
	  	this.dragon_move = -1;
	  } else if(this.dragon.y <= 100) {
	  	// Enemy movement
	 	 this.dragon_move = 1;
	  }

	  this.dragon.y += this.dragon_move;

	  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.dragon.getBounds())) {
	    this.lives--;
	  	this.liveText.setText("Lives: " + this.lives);
	  	this.end();
    }
    
	  if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.gold.getBounds())) {
	    this.score +=50;
	  	this.scoreText.setText("Score: " + this.score);
	  	this.end();
	  }

	}


	end() {
		if(this.lives <= 0) {
			this.scene.start("EndScene");
		} else {
			this.create();
		}
	}

}