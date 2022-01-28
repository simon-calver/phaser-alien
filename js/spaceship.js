export default class SpaceShip {
  constructor(scene, x, y) {
    this.scene = scene;

    this.beamForce = 0.0015;

    this.sprite = scene.add.image(50, 50, 'spaceship').setDepth(100);//.setOrigin(0, 0);

    // Graphics object to draw rays with
    this.graphics = scene.add.graphics()

    this.setUpRaycaster();

    this.scene.events.on("update", this.update, this);



    // Redraw on mouse move
    scene.input.on('pointermove', function (pointer) {
      // //set ray position
      // this.ray.setOrigin(pointer.x, pointer.y);

      this.sprite.setPosition(pointer.x, pointer.y);
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

  }

  setUpRaycaster() {
    let raycaster = this.scene.raycasterPlugin.createRaycaster();
    this.ray = raycaster.createRay({
      origin: {
        x: 60,
        y: 20
      }
    })

    // Enable matter physics body
    this.ray.enablePhysics('matter');
    this.ray.autoSlice = true; // Needs this for overlap detection to work

    // Map obstacles, the boolean value denotes whether this is dynamic
    raycaster.mapGameObjects(this.scene.obstacles.getChildren(), true, {
      type: 'MatterBody'
    });
    raycaster.mapGameObjects(this.scene.mapLayer, false, {
      collisionTiles: [1, 4, 5, 6, 29, 30] // Array of tile types which collide with rays
    });

    this.ray.setConeDeg(30);
    this.ray.setAngleDeg(90);

    // Cast ray in a cone
    this.intersections = this.ray.castCone();
  }

  draw() {
    // Add ray origin to intersections to create full polygon
    this.intersections.push(this.ray.origin);
    this.graphics.clear();

    this.graphics.fillStyle(0xffffff, 0.3);
    this.graphics.fillPoints(this.intersections);

    this.graphics.lineGradientStyle(4, 0xeeffee, 0x00ff00, 0xeeffee, 0x00ff00, 0.1);

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
  }

  update() {
    this.ray.setOrigin(this.sprite.x, this.sprite.y);
    this.intersections = this.ray.castCone();
    this.draw();
  }
}
