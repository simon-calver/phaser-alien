export default class SpaceShip {
  constructor(scene, x, y) {
    this.scene = scene;

    this.beamForce = 0.0015;

    // this.sprite = scene.matter.add.sprite(50, 50, 'spaceship').setDepth(100).setIgnoreGravity(true).setFixedRotation();//.setOrigin(0, 0);

    this.sprite = scene.matter.add.image(50, 50, 'spaceship').setDepth(100).setScale(1.4);
    this.sprite.setCircle(20, { restitution: 0, friction: 1, density: 100, render: { sprite: { yOffset: -0.2 } } }).setIgnoreGravity(true).setFixedRotation();
    // { shape: { restitution: 0, friction: 1, density: 100 }, render: { sprite: { yOffset: -0.15 } } }
    // Graphics object to draw rays with
    this.graphics = scene.add.graphics()

    this.setUpRaycaster();

    this.scene.events.on("update", this.update, this);



    // Redraw on mouse move
    scene.input.on('pointermove', function (pointer) {
      // //set ray position
      // this.ray.setOrigin(pointer.x, pointer.y);

      this.sprite.setPosition(pointer.worldX, pointer.y);
    }, this);


    scene.input.on('pointerdown', function (pointer) {
      this.timer = scene.time.addEvent({
        startAt: 0,
        delay: 20,
        loop: true,
        callback: () => {
          this.beam(pointer)
        }
      }, this);
    }, this);

    scene.input.on('pointerup', function (pointer) {
      this.timer.remove();
    }, this);

    // this.sprite.setOnCollideWith(scene.obstacles, pair => {

    //   console.log("GGIIG"); // Do something
    // });

    // console.log(this.sprite)
    // scene.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
    //   // console.log("HI")
    //   if (this.sprite == bodyA.gameObject || this.sprite == bodyB.gameObject) {
    //     console.log("HI")
    //     for (let object of [bodyA.gameObject, bodyB.gameObject]) {
    //       // console.log(object)
    //       if (scene.obstacles.contains(object)) {
    //         this.raycaster.removeMappedObjects(object);
    //         object.destroy();
    //       }
    //     }
    //   }


    // bodyA.gameObject.setTint(0xff0000);
    // bodyB.gameObject.setTint(0x00ff00);

    // });

    // collision category
    // http://labs.phaser.io/edit.html?src=src\physics\matterjs\collision%20filter.js


    this.sprite.setOnCollide(pair => {
      // console.log(pair.gameObjectA)
      // if (scene.obstacles.contains(pair.gameObjectA)) {
      //   pair.gameObjectA.destoy()
      // }
      for (let object of [pair.gameObjectA, pair.gameObjectB]) {
        // console.log(object)
        if (scene.obstacles.contains(object)) {
          this.raycaster.removeMappedObjects(object);
          object.destroy();
        }
      }
      // console.log(pair)
      // console.log(pair.bodyB)
    });

    // this.sprite.

    //   scene.matterCollision.addOnCollideStart({
    //     objectA: [this.sprite],
    //     callback: this.onSensorCollide,
    //     context: this,
    //   });


    //   You can add the collision event callback to the object itself.



    //     var paddle = this.matter.add.image(400, 550, 'assets', 'paddle.png');
    //     var paddle.setOnCollide(pair => {
    //       // pair.bodyA
    //       // pair.bodyB
    //     });



    // See the documentation under enableCollisionEventsPlugin(): https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Matter.MatterPhysics.html and also what a pair looks like: https://brm.io/matter-js/docs/files/src_collision_Pair.js.html#



    // You can also listen for specific collisions.



    //     var paddle.setOnCollideWith(ball, pair => {
    //       // Do something
    //     });


    // scene.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
    //   // if((bodyA.label == "plane" && bodyB.label == "obstacle") || (bodyB.label == "plane" && bodyA.label == "obstacle")) {
    //   //     if(plane.anims.getCurrentKey() != "explode") {
    //   //         plane.play("explode");
    //   //         plane.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
    //   //             plane.destroy();
    //   //         });
    //   //     }
    //   // }
    // });



    // this.ray.setOnCollide(function (collisionInfo) {
    //   //get body
    //   let body = collisionInfo.bodyA.label === 'phaser-raycaster-ray-body' ? collisionInfo.bodyB : collisionInfo.bodyA;
    //   /*
    //   * What to do with game object which enters line of sight .
    //   */
    //   console.log(body)
    // });

    // this.ray.setOnCollide(function (collisionInfo) {
    //   //get body
    //   let body = collisionInfo.bodyA.label === 'phaser-raycaster-ray-body' ? collisionInfo.bodyB : collisionInfo.bodyA;
    //   /*
    //   * What to do with game object while it's in line of sight.
    //   */
    //   console.log(body)
    // });
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    console.log("HI");
  }
  setUpRaycaster() {
    this.raycaster = this.scene.raycasterPlugin.createRaycaster();
    this.ray = this.raycaster.createRay({
      origin: {
        x: 60,
        y: 20
      }
    })

    // Enable matter physics body
    this.ray.enablePhysics('matter');
    this.ray.autoSlice = true; // Needs this for overlap detection to work

    // Map obstacles, the boolean value denotes whether this is dynamic
    this.raycaster.mapGameObjects(this.scene.obstacles.getChildren(), true, {
      type: 'MatterBody'
    });
    this.raycaster.mapGameObjects(this.scene.staticObstacles.getChildren(), false, {
      type: 'MatterBody'
    });
    // raycaster.mapGameObjects(this.scene.mapLayer, false, {
    //   collisionTiles: [1, 4, 5, 6, 29, 30] // Array of tile types which collide with rays
    // });
    // raycaster.mapGameObjects(this.scene.player.sprite, true);
    this.raycaster.mapGameObjects(this.scene.player.mainBody, true);

    this.ray.setConeDeg(30);
    this.ray.setAngleDeg(90);

    // Cast ray in a cone
    this.intersections = this.ray.castCone();

    // this.ray.setOnCollideWith(this.scene.obstacles, function (body, collisionInfo) {
    //   /*
    //   * What to do with game object which enters line of sight.
    //   */
    //   console.log("HI")
    // });
  }

  draw() {
    // Add ray origin to intersections to create full polygon
    this.intersections.push(this.ray.origin);
    this.graphics.clear();

    let fillColour;
    let lineTopColour;
    let lineBottomColour;
    // console.log(this.ray.overlap(this.scene.player))
    if (this.ray.overlap(this.scene.player.mainBody)?.length) { //this.ray.testMatterOverlap(this.scene.player.sprite)) {
      fillColour = 0xffeeee;
      lineTopColour = 0xffeeee;
      lineBottomColour = 0xff0000;
    } else {
      fillColour = 0xeeffee;
      lineTopColour = 0xeeffee;
      lineBottomColour = 0x00ff00;
    }
    this.graphics.fillStyle(fillColour, 0.3);
    this.graphics.fillPoints(this.intersections);

    this.graphics.lineGradientStyle(4, lineTopColour, lineBottomColour, lineTopColour, lineBottomColour, 0.1);

    for (let intersection of this.intersections) {
      this.graphics.strokeLineShape({
        x1: this.ray.origin.x,
        y1: this.ray.origin.y,
        x2: intersection.x,
        y2: intersection.y
      });
    }
  }

  beam() {
    // do a different loop iterator
    for (var [index, object] of this.scene.obstacles.getChildren().entries()) {
      if (this.ray.testMatterOverlap(object)) {
        const forceToShip = this.sprite.getCenter().subtract(object.getCenter()).normalize().scale(this.beamForce);
        object.applyForce(forceToShip)
      }
    }

    // Turn static matter bodies into dynamic ones
    // for (var [index, object] of this.scene.staticObstacles.getChildren().entries()) {
    //   if (this.ray.testMatterOverlap(object)) {

    //     let newObjectX = object.x;
    //     let newObjectY = object.y;
    //     let newObjectTexture = object.frame.name.split(".")[0];

    //     // Remove static object
    //     this.raycaster.removeMappedObjects(object);
    //     object.destroy();
    //     // this.scene.staticObstacles.remove(object);
    //     var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
    //     var bridgeShapes = this.scene.cache.json.get('bridge-shapes');
    //     // console.log(bridgeShapes)
    //     // let newObject = this.scene.matter.add.sprite(newObjectX, newObjectY, 'bridge-parts', `{newObjectTexture}.png`, { shape: bridgeShapes[newObjectTexture], isStatic: false, density: 1000 });
    //     // console.log(newObject);
    //     let oo = Parser.parseBody(newObjectX, newObjectY, bridgeShapes[newObjectTexture]);
    //     console.log(oo)
    //     // let newBody = this.scene.matter.bodies.fromVertices(
    //     //   object.x,
    //     //   object.y,
    //     //   bridgeShapes[object.frame.name.split(".")[0]].fixtures[0].vertices[0],
    //     //   {
    //     //     isStatic: false,
    //     //     isSensor: false
    //     //   }
    //     // );
    //     object.setExistingBody(oo, true);

    //     // // Add dynamic object
    //     // this.scene.obstacles.add(newObject, true);
    //     // this.raycaster.mapGameObjects(newObject, true, {
    //     //   type: 'MatterBody'
    //     // });
    //   }
    // }
    for (var [index, object] of this.scene.staticObstacles.getChildren().entries()) {
      if (this.ray.testMatterOverlap(object)) {

        // Remove static object
        this.raycaster.removeMappedObjects(object);
        this.scene.staticObstacles.remove(object);

        var bridgeShapes = this.scene.cache.json.get('bridge-shapes');

        var Parser = Phaser.Physics.Matter.PhysicsEditorParser;
        let newBody = Parser.parseBody(object.x, object.y, bridgeShapes[object.frame.name.split(".")[0]], { 'density': 0.01 });
        // console.log(newBody);
        // newBody.setDensity(1);
        // let newBody = this.scene.matter.bodies.fromVertices(
        //   object.x,
        //   object.y,
        //   bridgeShapes[object.frame.name.split(".")[0]].fixtures[0].vertices[0],
        //   {
        //     isStatic: false,
        //     isSensor: false
        //   }
        // );
        object.setExistingBody(newBody, true);

        // Add dynamic object
        this.scene.obstacles.add(object, true);
        this.raycaster.mapGameObjects(object, true, {
          type: 'MatterBody'
        });

        // this.scene.matter.add.fromJSON(object.x, object.y, bridgeShapes[object.frame.name.split(".")[0]])
        // let pp2 = Phaser.Physics.Matter.PhysicsJSONParser;
        // console.log(pp2.parseBody(object.x, object.y, bridgeShapes[object.frame.name.split(".")[0]]))
      }
    }
  }

  update() {
    this.ray.setOrigin(this.sprite.x, this.sprite.y);
    this.intersections = this.ray.castCone();
    this.draw();
  }
}
