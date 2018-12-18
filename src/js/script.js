var speed = 10;
var keyPlane = [];
var obstacleInterval;
var moveInterval;
var removeInterval;
var boatInterval;
var sharkInterval;
var collisionInterval;
var accelerationInterval;
var size = 40;
var xObstacle = 1280 / 40;
var yObstacle = 480 / 40;
var countWaste = 0;

oxo.screens.loadScreen("game", game);

// function moveElementWithKeys(element, speed) {
//   var pixels = speed > 100 ? Math.round(speed / 100) : 1;
//   var interval;
//   var pressed = [];

//     document.addEventListener('', function(event) {
//   }
// }

function game() {
  var submarine = oxo.elements.createElement({
    type: "div",
    class: "submarine",
    styles: {
      transform: "translate(50px, 200px)"
    },
    appendTo: "#water"
  });

  var plane = oxo.elements.createElement({
    type: "div",
    class: "plane",
    appendTo: "#box"
  });

  // plane moves

  oxo.inputs.listenKeys(["q", "d"], function(key) {
    var position = oxo.animation.getPosition(plane);
    console.log(position);
    if (key === "q" && position.x > 0) {
      oxo.animation.move(plane, "left", 20);
    }
    if (key === "d" && position.x < 420) {
      oxo.animation.move(plane, "right", 20);
    }
  });

  // submarine moves
  oxo.animation.moveElementWithArrowKeys(submarine, 100);
  // submarine death
  oxo.elements.onLeaveScreenOnce(submarine, function() {
    console.log("end");
  });

  // Score
  setInterval(addScore, speed * 10);

  //Obstacles
  obstacleInterval = setInterval(addObstacle, 1500); // Call the addObstacle function every 150 turn

  //Add Boat
  boatInterval = setInterval(addBoat, 5000);

  //Add Shark
  sharkInterval = setInterval(addShark, 3000);

  //collisions
  collisionInterval = setInterval(listenCollision, 500);

  //Move
  moveInterval = setInterval(move, speed);

  //Remove
  removeInterval = setInterval(remove, 5000);

  //Acceleration
  accelerationInterval = setInterval(acceleration, 100);

  //Array key pressed
  var pressed = [];
  document.addEventListener("keydown", function(event) {
    if (pressed.indexOf(event.key) == -1) {
      pressed.push(event.key);
      console.log(pressed);
    }
  });

  document.addEventListener("keyup", function(event) {
    if (pressed.indexOf(event.key) > -1) {
      pressed = pressed.filter(key => key !== event.key);
      console.log(pressed);
    }
  });
}

function addObstacle() {
  // Add an obstacle element to the screen at a random position
  obstacle = oxo.elements.createElement({
    class: "obstacle obstacle--death obstacle--rock move",
    styles: {
      transform:
        "translate(" +
        (oxo.utils.getRandomNumber(0, xObstacle - 1) * size + 1280) +
        "px, " +
        oxo.utils.getRandomNumber(0, yObstacle - 1) * size +
        "px)" // PROBLEME : ne pop pas au dessus d'une certaine ligne
    },
    appendTo: "#water"
  });

  //Add obstacle--waste to the screen at a random position
  obstacle = oxo.elements.createElement({
    class: "obstacle obstacle--waste move",
    styles: {
      transform:
        "translate(" +
        (oxo.utils.getRandomNumber(0, xObstacle - 1) * size + 1280) +
        "px, " +
        oxo.utils.getRandomNumber(0, yObstacle - 1) * size +
        "px)" // PROBLEME : ne pop pas au dessus d'une certaine ligne
    },
    appendTo: "#water"
  });
}

function addBoat() {
  //Add obstacle--boat hitboxe in the water
  if (oxo.player.getScore() > 200) {
    obstacle = oxo.elements.createElement({
      class: "obstacle obstacle--death obstacle--boat hitboxe move",
      styles: {
        transform: "translate(" + (3 * size + 1280) + "px, " + -3 * size + "px)"
      },
      appendTo: "#water"
    });

    // // add sprite boat on the water, on the same position than the other boat
    obstacle = oxo.elements.createElement({
      class: "obstacle obstacle--death obstacle--boat move",
      styles: {
        transform: "translate(" + (3 * size + 1280) + "px, " + 7 * size + "px)"
      },
      appendTo: "#water__top"
    });
  }
}

function addShark() {
  //Add obstacle--shark
  if (oxo.player.getScore() > 100) {
    obstacle = oxo.elements.createElement({
      class: "obstacle obstacle--death obstacle--shark move",
      styles: {
        transform:
          "translate(" +
          (oxo.utils.getRandomNumber(0, xObstacle - 1) * size + 1280) +
          "px, " +
          oxo.utils.getRandomNumber(0, yObstacle - 1) * size +
          "px)"
      },
      appendTo: "#water"
    });
  }
}

function listenCollision() {
  var collectable = [];
  var death = [];
  var submarineLoop = document.querySelector(".submarine"); // changer cette ligne, définir tout en haut ?
  var collectable = document.querySelectorAll(".obstacle--waste");
  var death = document.querySelectorAll(".obstacle--death");
  for (let i = 0; i < collectable.length; i++) {
    // if (collectable !== []) {
    oxo.elements.onCollisionWithElementOnce(
      submarineLoop,
      collectable[i],
      function() {
        collectable[i].remove();
        // Add count waste
        countWaste++;
        console.log(countWaste);
        document.getElementById("score--waste").innerHTML = countWaste;
      }
    );
    // }
    // if (death !== []) {
    oxo.elements.onCollisionWithElementOnce(
      submarineLoop,
      death[i],
      function() {
        console.log("dead");
        // ecran de fin
      }
    );
    // }
  }
}

function move() {
  var allMovableElements = document.querySelectorAll(".move");
  for (let i = 0; i < allMovableElements.length; i++) {
    oxo.animation.move(allMovableElements[i], "left", 5, true); // move all elements with class .move to the left by 10px
  }

  // Demande trop de ressources

  // var collectable = document.querySelectorAll(".obstacle--waste");
  // var submarineLoop = document.querySelector('.submarine') // changer cette ligne, définir tout en haut le submarine !
  // for (let i = 0; i < collectable.length; i++) {
  //   oxo.elements.onCollisionWithElementOnce(submarineLoop, collectable[i], function() {
  //     collectable[i].();
  //     // Add count waste
  //   });
  // }
}

function remove() {
  var allMovableElements = document.querySelectorAll(".move");
  for (let i = 0; i < allMovableElements.length; i++) {
    //get position.x to  if it is out of the screen (on the left)
    var position = oxo.animation.getPosition(allMovableElements[i]);
    if (position.x < -270) {
      allMovableElements[i].remove();
    }
  }
}

function acceleration() {
  speed = speed - 1; // MARCHE PAS
}

function addScore() {
  //oxo.player.addToScore(1);
}
