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

    this.beamForce = 0.0015;
  };

  preload() {
    this.load.image('crate', 'phaser-alien/assets/crate.png');
    this.load.image('spaceship', 'phaser-alien/assets/spaceship.png');

    this.loadMap();
  }

  create() {

    // Background
    const background = this.add.image(400, 300, 'background');
    background.setScrollFactor(0);

    this.spaceship = this.add.image(50, 50, 'spaceship').setDepth(100); //.setImmovable(true);
    this.cameras.main.startFollow(this.spaceship);//, false, 0.5, 0.5);
    // this.spaceship = this.matter.add.sprite(50, 50, 'spaceship').setIgnoreGravity(true); //.setImmovable(true);
    // this.spaceship.body.setAllowGravity(false);

    // let oo = this.add.image(200, 250, 'ground-tiles')


    const startPoint = this.buildMap();

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
    this.ray.autoSlice = true; // needs this for overlap to work

    //map obstacles, neccessary
    raycaster.mapGameObjects(this.obstacles.getChildren(), true, {
      type: 'MatterBody'
    }); // true is for dynamic 
    raycaster.mapGameObjects(this.mapLayer, false, {
      // type: 'MatterBody',
      collisionTiles: [1, 4, 5, 6, 29, 30] //array of tile types which collide with rays
    });
    // ray map not use body shape from tiled so edge peices are ignored and light goes bhind them
    // raycaster.mapGameObjects(oo);
    //set ray cone size (angle)
    this.ray.setConeDeg(30);
    this.ray.setAngleDeg(90);
    // this.ray.setCollisionRange(200);

    //cast ray in a cone
    this.intersections = this.ray.castCone();

    //draw rays
    this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00, alpha: 0.4 }, fillStyle: { color: 0xffffff, alpha: 0.3 } });
    this.draw();

    //redraw on mouse move
    this.input.on('pointermove', function (pointer) {
      //set ray position
      this.ray.setOrigin(pointer.x, pointer.y);

      this.spaceship.setPosition(pointer.x, pointer.y);
    }, this);


    this.input.on('pointerdown', function (pointer) {
      // this.beam(pointer)
      console.log(pointer.position)
      this.timer = this.time.addEvent({
        startAt: 0,
        delay: 20,
        loop: true,
        callback: () => {
          this.beam(pointer)
        }
      }, this);
    }, this);

    this.input.on('pointerup', function (pointer) {
      this.timer.remove();
    }, this);
  }

  beam(pointer) {
    // do a different loop iterator
    for (var [index, object] of this.obstacles.getChildren().entries()) {
      if (this.ray.testMatterOverlap(object)) {
        let pointerCopy = pointer.position.clone()
        const forceToPointer = pointerCopy.subtract(object.getCenter()).normalize().scale(this.beamForce);
        object.applyForce(forceToPointer)
      }
    }
  }

  draw() {
    //add ray origin to intersections to create full polygon
    this.intersections.push(this.ray.origin);
    this.graphics.clear();
    this.graphics.fillStyle(0xffffff, 0.3);
    this.graphics.fillPoints(this.intersections);
    for (let intersection of this.intersections) {
      // console.log(intersection.object)
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

  update() {

    this.intersections = this.ray.castCone();

    //redraw
    this.draw();


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

    // Get list of all tilesets used
    let tiles = [];
    for (var tileset of map.tilesets) {
      tiles.push(map.addTilesetImage(tileset.name, tileset.name)); // The first argument is the tileset name in Tiled and the second the name it has in Phaser   
    }

    for (var layer of map.layers) {
      const depth = layer.properties.find(obj => obj.name == 'Depth').value;

      const mapLayer = map.createLayer(layer.name, tiles, 0, 0).setDepth(depth);

      if (layer.name == 'ground') {
        mapLayer.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(mapLayer);

        this.mapLayer = mapLayer;
      }

    }

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

      let oo = this.matter.add.sprite(item.x, item.y, 'crate');
      // oo.setCollisionCategory(this.targetsCategory)
      this.obstacles.add(oo, true);

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