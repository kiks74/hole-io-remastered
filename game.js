// Crée un nouveau jeu avec Phaser
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let hole;
let objects;
let score = 0;

const game = new Phaser.Game(config);

function preload() {
  // Charger des assets comme les objets et le trou
  this.load.image('hole', 'assets/hole.png'); // trou noir
  this.load.image('object', 'assets/object.png'); // objets à engloutir
}

function create() {
  // Créer le trou noir
  hole = this.add.image(400, 300, 'hole');
  hole.setOrigin(0.5, 0.5);
  hole.setScale(0.2); // Taille initiale du trou
  
  // Créer des objets à engloutir
  objects = this.physics.add.group({
    key: 'object',
    repeat: 50,
    setXY: { x: 100, y: 100, stepX: 70 }
  });

  objects.children.iterate(function(child) {
    child.setBounce(1);
    child.setCollideWorldBounds(true);
    child.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
  });

  // Gérer les mouvements du joueur
  this.input.on('pointermove', function (pointer) {
    hole.x = pointer.x;
    hole.y = pointer.y;
  });
}

function update() {
  // Vérifier si le trou engloutit un objet
  objects.children.iterate(function(child) {
    if (Phaser.Geom.Intersects.RectangleToRectangle(hole.getBounds(), child.getBounds())) {
      child.setAlpha(0);  // Faire disparaître l'objet
      score += 1;  // Augmenter le score
      console.log('Score:', score);
      // Augmenter la taille du trou
      hole.setScale(0.2 + score * 0.01);
    }
  });
}
