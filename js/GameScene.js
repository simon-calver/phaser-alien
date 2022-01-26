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

    this.beamForce = 0.003;
  };

  preload() {
    this.load.image('crate', 'phaser-alien/assets/crate.png');
    this.loadMap();
  }

  create() {
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
    this.ray.autoSlice = true;

    //map obstacles, neccessary
    raycaster.mapGameObjects(this.obstacles.getChildren(), true, {
      type: 'MatterBody'
    });
    raycaster.mapGameObjects(this.mapLayer, false, {
      collisionTiles: [1, 2] //array of tile types which collide with rays
    });

    //set ray cone size (angle)
    this.ray.setConeDeg(60);
    this.ray.setAngleDeg(90);
    this.ray.setCollisionRange(200);

    //cast ray in a cone
    this.intersections = this.ray.castCone();

    //get field of view slices
    // let slices = this.ray.slicedIntersections; // why are there none???
    // console.log(slices);
    //draw rays
    this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 }, fillStyle: { color: 0xffffff, alpha: 0.3 } });
    this.draw();


    // // make obstacked ynamic
    // for (let obstacle of this.obstacles.getChildren()) {
    //   // console.log()
    //   //get map
    //   let map = obstacle.data.get('raycasterMap')
    //   //toggle map update
    //   map.dynamic = true;

    // }

    //redraw on mouse move
    this.input.on('pointermove', function (pointer) {
      //set ray position
      this.ray.setOrigin(pointer.x, pointer.y);
      //cast ray in all directions

      // this.intersections = this.ray.castCone();

      // // this.intersections = this.ray.castCircle();
      // //redraw
      // this.draw();
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



    // this.input.on('pointerdown', function (pointer) {

    //   for (var [index, object] of this.obstacles.getChildren().entries()) {
    //     if (this.ray.testMatterOverlap(object)) {
    //       // console.log(object.getCenter())
    //       // console.log(pointer.position); //.subtract(object.getCenter()));
    //       // console.log(pointer.position.subtract(object.getCenter()).normalize().scale(0.03));
    //       const forceToPointer = pointer.position.subtract(object.getCenter()).normalize().scale(this.beamForce);
    //       // console.log(forceToPointer)
    //       object.applyForce(forceToPointer)
    //       // let Phaser.Math.Vector2(centre.x, centre.y);
    //       // object.accelerateTo(pointer.x, pointer.y, 30)
    //       // object.applyForce({ x: 0, y: -0.03 });
    //     }
    //   }

    //   //   let body = object.body;
    //   //   let parts = body.parts.length > 1 ? body.parts.splice(1) : body.parts;
    //   //   for (let part of parts) {
    //   //     let pointA = part.vertices[0];

    //   //     for (let i = 1, length = part.vertices.length; i < length; i++) {
    //   //       let pointB = part.vertices[i];
    //   //       let segment = new Phaser.Geom.Line(pointA.x, pointA.y, pointB.x, pointB.y);
    //   //       // console.log(segment)
    //   //       //iterate through field of view slices to check collisions with target
    //   //       console.log(this.ray.slicedIntersections)
    //   //       for (let slice of this.ray.slicedIntersections) {
    //   //         // console.log(slice)
    //   //         let overlap = Phaser.Geom.Intersects.TriangleToLine(slice, segment);
    //   //         //additional checking if slice contain segment's points due to TriangleToLine bug.
    //   //         if (!overlap)
    //   //           overlap = Phaser.Geom.Triangle.ContainsPoint(slice, segment.getPointA());
    //   //         if (!overlap)
    //   //           overlap = Phaser.Geom.Triangle.ContainsPoint(slice, segment.getPointB());

    //   //         if (overlap) {
    //   //           console.log("SSSSSSSSSSSSSSSSSS")
    //   //           // return true;
    //   //         }
    //   //       }
    //   //       pointA = pointB;
    //   //     }

    //   //   }


    //   // console.log(parts)
    //   // if (object.type === 'body')
    //   //   console.log("body")
    //   // else if (object.body !== undefined)
    //   //   console.log("undefined")
    //   // else
    //   //   console.log("false")


    //   // console.log(object)
    //   // console.log(this.ray.testMatterOverlap(object)); //overlap(enemyGroup))
    //   // }

    //   // let visibleObjects = this.ray.overlap(this.obstacles.getChildren()); // this doesn't work

    //   // for (let ind in this.obstacles.getChildren()) {
    //   //   console.log(this.obstacles[ind])
    //   // }


    //   // let visibleObjects = this.ray.overlap(this.obstacles.getChildren()); // this doesn't work

    //   // // console.log(visibleObjects);
    //   // for (let intersection in this.intersections) {
    //   //   console.log(intersection);
    //   // }
    //   // console.log(this.intersections);

    //   // console.log(this.ray.overlap(this.oo))
    //   // if (pointer.rightButtonDown()) {
    //   //   this.switchWeapons();
    //   // } else {
    //   //   if (this.weaponEquipped && !this.overItem && this.weapon.canAttack()){ 
    //   //     this.weapon.attack(pointer); // startAt 0 doesn't do what I want so run the callback once before the timer
    //   //     this.timer = this.scene.time.addEvent({
    //   //       startAt: 0,
    //   //       delay: this.weapon.attackSpeed,
    //   //       loop: true,
    //   //       callback: () => {
    //   //         this.weapon.attack(pointer)
    //   //       }
    //   //     }, this);                      
    //   //   }
    //   // }      
    // }, this);



    // this.rat = this.matter.add.sprite(300, 20, 'rat', 1, {
    //   restitution: 1,
    //   friction: 0.25,
    //   shape: "circle"
    // }); //, { shape: spritePhysics.plane });
    // // // var rat = this.add.sprite(60, 20, 'rat');
    // this.targetsCategory = this.matter.world.nextCategory();

    // let target = this.add.rectangle(450, 50, 50, 50)
    //   .setFillStyle(0x00ff00);
    // this.matter.add.gameObject(target);
    // // target.setCollisionCategory(this.targetsCategory)

    // this.target = target;
    // const startPoint = this.buildMap();

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


    // //create raycaster
    // let raycaster = this.raycasterPlugin.createRaycaster();

    // //create ray
    // this.ray = raycaster.createRay({
    //   origin: {
    //     x: 60,
    //     y: 20
    //   }
    // })

    // //enable matter physics body
    // this.ray.enablePhysics('matter');

    // //map obstacles
    // raycaster.mapGameObjects(this.obstacles.getChildren());
    // raycaster.mapGameObjects(this.mapLayer, false, {
    //   collisionTiles: [1, 2] //array of tile types which collide with rays
    // });

    // this.oo = this.matter.add.sprite(300, 20, 'rat'); //this.add.image(150, 100, 'crate');
    // raycaster.mapGameObjects(this.oo);

    // // raycaster.mapGameObjects(target);


    // //set ray cone size (angle)
    // this.ray.setConeDeg(60);
    // this.ray.setAngleDeg(90);
    // //cast ray in a cone
    // this.intersections = this.ray.castCone();


    // this.ray.setCollisionRange(200);

    // // this.intersections = this.ray.castCircle();

    // //draw rays
    // this.graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 }, fillStyle: { color: 0xffffff, alpha: 0.3 } });
    // this.draw();

    // createTargets(this);

    // this.ray.setCollidesWith(this.targetsCategory);//this.obstacles.getChildren());//
    // // console.log(this.targetsCategory);

    // this.ray.setOnCollide(function (collisionInfo) {
    //   //get body
    //   // let body = collisionInfo.bodyA.label === 'phaser-raycaster-ray-body' ? collisionInfo.bodyB : collisionInfo.bodyA;
    //   console.log("AAAAAA");
    // });

    //add onCollideWith event
    // this.ray.setOnCollideWith(body, function (body, collisionInfo) {
    //   console.log("HI");
    //   /*
    //   * What to do with game object which enters line of sight.
    //   */
    // });

    // //redraw on mouse move
    // this.input.on('pointermove', function (pointer) {
    //   //set ray position
    //   this.ray.setOrigin(pointer.x, pointer.y);
    //   //cast ray in all directions

    //   this.intersections = this.ray.castCone();

    //   // this.intersections = this.ray.castCircle();
    //   //redraw
    //   this.draw();
    // }, this);

    // this.input.on('pointerdown', function (pointer) {
    //   let visibleObjects = this.ray.overlap(this.oo); // this doesn't work

    //   console.log(visibleObjects);
    //   // console.log(this.intersections);

    //   // console.log(this.ray.overlap(this.oo))
    //   // if (pointer.rightButtonDown()) {
    //   //   this.switchWeapons();
    //   // } else {
    //   //   if (this.weaponEquipped && !this.overItem && this.weapon.canAttack()){ 
    //   //     this.weapon.attack(pointer); // startAt 0 doesn't do what I want so run the callback once before the timer
    //   //     this.timer = this.scene.time.addEvent({
    //   //       startAt: 0,
    //   //       delay: this.weapon.attackSpeed,
    //   //       loop: true,
    //   //       callback: () => {
    //   //         this.weapon.attack(pointer)
    //   //       }
    //   //     }, this);                      
    //   //   }
    //   // }      
    // }, this);
  }

  beam(pointer) {
    console.log(pointer.position)


    // do a different loop 
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

    this.intersections = this.ray.castCone();

    // this.intersections = this.ray.castCircle();
    //redraw
    this.draw();
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
      this.mapLayer = mapLayer;
    }

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

      let oo = this.matter.add.sprite(item.x, item.y, 'crate');
      // oo.setCollisionCategory(this.targetsCategory)
      this.obstacles.add(oo, true);
      // , {
      // restitution: 1,
      //   friction: 0.25,
      //   shape: "circle"
      // }); //, { shape: spritePhysics.plane });
      // // var rat = this.add.sprite(60, 20, 'rat');
    }

    // make these dynamic



    // let obstacle = this.add.image(100, 100, 'crate');
    // // console.log("object");
    // // console.log(obstacle);
    // this.obstacles.add(obstacle, true)
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