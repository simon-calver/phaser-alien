import Player from "./player.js";

export default class GameScene extends Phaser.Scene {

  constructor() {
    super("GameScene");
  }

  init() {
    // game variables
    this.score = 0;
    this.lives = 3;
    this.speed = 1.5;
    this.dragon_move = 1;
    this.score_text;
    this.lives_text;
  };

  preload() {
    // lets preload some images that we can use in our game (add these to the preloader)
    // this.load.image('background', 'images/tut/background.png');
    // this.load.image('player', 'phaser-alien/assets/.png');
    // this.load.image('dragon', 'images/tut/pet_dragon_new.png');
    // this.load.image('gold', 'images/tut/icon.png');
    this.load.spritesheet('rat', 'phaser-alien/assets/$Rat.png', { frameWidth: 26, frameHeight: 26 });

    this.loadMap();
  }

  create() {

    // this.rat = this.matter.add.sprite(300, 20, 'rat', 1, {
    //   restitution: 1,
    //   friction: 0.25,
    //   shape: "circle"
    // }); //, { shape: spritePhysics.plane });
    // // var rat = this.add.sprite(60, 20, 'rat');

    const startPoint = this.buildMap();

    // var image = this.add.image(60, 20, 'PSF_A5_Lodge');

    // this.player = new Player(this, startPoint.x, startPoint.y);

    // // Smoothly follow the player
    // this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);



    // this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
    //   objectA: this.player.sprite,
    //   callback: this.onPlayerCollide,
    //   context: this,
    // });
    // this.unsubscribeCelebrate = this.matterCollision.addOnCollideStart({
    //   objectA: this.player.sprite,
    //   objectB: celebrateSensor,
    //   callback: this.onPlayerWin,
    //   context: this,
    // });
    // this.player = new Player(this, metaData.objects.find(obj => obj.name == 'start').x, metaData.objects.find(obj => obj.name == 'start').y);



    // const image2 = this.matter.add.image(300, 75, "emoji", "1f60d");


    // this.matter.world.drawDebug = true;


    // // add the background
    // var bg = this.add.sprite(0, 0, 'background');
    // bg.setOrigin(0, 0);

    // // add score text & game text to screen
    // this.scoreText = this.add.text(100, 16, 'score: ' + this.score, { fontSize: '32px', fill: '#000' });
    // this.liveText = this.add.text(16, this.sys.game.config.height - 50, 'Lives: ' + this.lives, { fontSize: '32px', fill: '#000' });

    // // add player
    // this.player = this.add.sprite(100, 150, 'player');
    // this.player.setScale(0.3);

    // // add monster
    // this.dragon = this.add.sprite(350, 150, 'dragon');
    // this.dragon.setScale(0.1);

    // // add gold
    // this.gold = this.add.sprite(650, 150, 'gold');
    // this.gold.setScale(0.5);


    //create raycaster
    let raycaster = this.raycasterPlugin.createRaycaster();

    //create ray
    this.ray = raycaster.createRay({
      origin: {
        x: 60,
        y: 20
      }
    })

    //enable matter physics body
    this.ray.enablePhysics('matter');

    //map obstacles
    raycaster.mapGameObjects(this.obstacles.getChildren());

    //set ray cone size (angle)
    this.ray.setConeDeg(60);
    this.ray.setAngleDeg(90);
    //cast ray in a cone
    this.intersections = this.ray.castCone();

    // this.intersections = this.ray.castCircle();

    //draw rays
    this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 }, fillStyle: { color: 0xffffff, alpha: 0.3 } });
    this.draw();


    this.ray.setOnCollide(function (collisionInfo) {
      //get body
      // let body = collisionInfo.bodyA.label === 'phaser-raycaster-ray-body' ? collisionInfo.bodyB : collisionInfo.bodyA;
      console.log("AAAAAA");
    });

    //add onCollideWith event
    // this.ray.setOnCollideWith(body, function (body, collisionInfo) {
    //   console.log("HI");
    //   /*
    //   * What to do with game object which enters line of sight.
    //   */
    // });

    //redraw on mouse move
    this.input.on('pointermove', function (pointer) {
      //set ray position
      this.ray.setOrigin(pointer.x, pointer.y);
      //cast ray in all directions

      this.intersections = this.ray.castCone();

      // this.intersections = this.ray.castCircle();
      //redraw
      this.draw();
    }, this);

    this.input.on('pointerdown', function (pointer) {
      let visibleObjects = this.ray.overlap();

      console.log(visibleObjects);
      console.log(this.intersections);
      // if (pointer.rightButtonDown()) {
      //   this.switchWeapons();
      // } else {
      //   if (this.weaponEquipped && !this.overItem && this.weapon.canAttack()){ 
      //     this.weapon.attack(pointer); // startAt 0 doesn't do what I want so run the callback once before the timer
      //     this.timer = this.scene.time.addEvent({
      //       startAt: 0,
      //       delay: this.weapon.attackSpeed,
      //       loop: true,
      //       callback: () => {
      //         this.weapon.attack(pointer)
      //       }
      //     }, this);                      
      //   }
      // }      
    }, this);
  }

  draw() {
    //add ray origin to intersections to create full polygon
    this.intersections.push(this.ray.origin);
    this.graphics.clear();
    this.graphics.fillStyle(0xffffff, 0.3);
    this.graphics.fillPoints(this.intersections);
    for (let intersection of this.intersections) {
      this.graphics.strokeLineShape({
        x1: this.ray.origin.x,
        y1: this.ray.origin.y,
        x2: intersection.x,
        y2: intersection.y
      });
    }
    this.graphics.fillStyle(0xff00ff);
    this.graphics.fillPoint(this.ray.origin.x, this.ray.origin.y, 3);
  }

  // draw() {
  //   this.graphics.clear();
  //   this.graphics.fillStyle(0xffffff, 0.3);
  //   this.graphics.fillPoints(this.intersections);
  //   for (let intersection of this.intersections) {
  //     this.graphics.strokeLineShape({
  //       x1: this.ray.origin.x,
  //       y1: this.ray.origin.y,
  //       x2: intersection.x,
  //       y2: intersection.y
  //     });
  //   }
  //   this.graphics.fillStyle(0xff00ff);
  //   this.graphics.fillPoint(this.ray.origin.x, this.ray.origin.y, 3);
  // }

  update() {

    // // Is mouse click down?
    // if (this.input.activePointer.isDown) {
    //   // move player along the x-axis at a rate this.speed pixels
    //   this.player.x += this.speed;
    // }


    // if (this.dragon.y >= 500) {
    //   // Enemy movement
    //   this.dragon_move = -1;
    // } else if (this.dragon.y <= 100) {
    //   // Enemy movement
    //   this.dragon_move = 1;
    // }

    // this.dragon.y += this.dragon_move;

    // if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.dragon.getBounds())) {
    //   this.lives--;
    //   this.liveText.setText("Lives: " + this.lives);
    //   this.end();
    // }

    // if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.gold.getBounds())) {
    //   this.score += 50;
    //   this.scoreText.setText("Score: " + this.score);
    //   this.end();
    // }

  }


  end() {
    if (this.lives <= 0) {
      this.scene.start("EndScene");
    } else {
      this.create();
    }
  }

  loadMap() {
    const tiledMapJson = this.cache.json.get('tiledMapJson');
    for (var tileset of tiledMapJson.tilesets) {
      this.load.image(tileset.name, `phaser-alien/assets/tilesets/${tileset.name}.png`);
    }

    this.load.tilemapTiledJSON('alien-map', 'phaser-alien/assets/tilemaps/alien.json');
  }


  buildMap() {


    this.obstacles = this.add.group();

    // Create the tilemap from the json file made in Tiled
    const map = this.make.tilemap({ key: 'alien-map' });
    // const metaData = map.objects.find(obj => obj.name == 'meta');

    // Get list of all tilesets used
    let tiles = [];
    for (var tileset of map.tilesets) {
      tiles.push(map.addTilesetImage(tileset.name, tileset.name)); // The first argument is the tileset name in Tiled and the second the name it has in Phaser   
    }

    // const tiles = map.addTilesetImage('PSF_A5_Lodge', 'PSF_A5_Lodge');


    for (var layer of map.layers) {
      const depth = layer.properties.find(obj => obj.name == 'Depth').value;
      // const collision = layer.properties.find(obj => obj.name == 'Collision').value;

      const mapLayer = map.createLayer(layer.name, tiles, 0, 0);//.setDepth(depth);


      // if (collision) {

      // this.collisionLayer.setCollisionByExclusion([-1]);
      mapLayer.setCollisionByProperty({ collides: true });
      this.matter.world.convertTilemapLayer(mapLayer);
      // this.physics.add.collider(mapLayer, this.rat);
      // }




      //   groundLayer.setCollisionByProperty({ collides: true });
      // lavaLayer.setCollisionByProperty({ collides: true });

      // // Get the layers registered with Matter. Any colliding tiles will be given a Matter body. We
      // // haven't mapped out custom collision shapes in Tiled so each colliding tile will get a default
      // // rectangle body (similar to AP).
      // this.matter.world.convertTilemapLayer(groundLayer);
      // this.matter.world.convertTilemapLayer(lavaLayer);
      // if (layer.name == 'collision') {
      //   const collisionTiles = map.addTilesetImage('squares', 'squares.png');

      //   this.collisionLayer = map.createLayer('collision', collisionTiles, 0, 0);
      //   this.collisionLayer.visible = false;
      //   this.collisionLayer.setCollisionByExclusion([-1]);
      // } else {
      //   const depth = layer.properties.find(obj => obj.name == 'Depth').value;

      //   // All Tiles are added to each layer, is that bad? It makes looping a lot easier!
      //   const mapLayer = map.createLayer(layer.name, tiles, 0, 0).setDepth(depth);

      // }
    }

    // this.mapLayer = this.mapLayer;
    // this.obstacles.add(this.mapLayer, true);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.matter.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


    // Moveable objects are defined in Tiled
    this.addMatterItems(map);

    // The start point is set using a point object inside of Tiled 
    const { x, y } = map.findObject("objects", (obj) => obj.name === "start");

    return { x, y }
  }

  addMatterItems(map) {



    let matterItems = this.getObjectsByName(map, 'objects', 'box');
    for (let item of matterItems) {

      this.obstacles.add(this.matter.add.sprite(item.x, item.y, 'rat', 1), true);
      // , {
      // restitution: 1,
      //   friction: 0.25,
      //   shape: "circle"
      // }); //, { shape: spritePhysics.plane });
      // // var rat = this.add.sprite(60, 20, 'rat');
    }
  }



  getObjectsByName(map, objectLayer, objectName, objectType = null) {
    let objects = map.objects.find(obj => obj.name == objectLayer).objects;
    let itemList = objects.filter(function (object) {
      if (objectType == null) {
        return object.name == objectName;
      } else {
        return object.name == objectName && object.type == objectType;
      }
    });
    return itemList;
  }
}