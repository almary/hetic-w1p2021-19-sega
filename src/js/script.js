var speed = 20;
var keyPlane = [];
var obstacleInterval;
var moveInterval;
var moveDownInterval;
var removeInterval;
var boatInterval;
var sharkInterval;
var collisionInterval;
var accelerationInterval;
var planeInterval;
var size = 40;
var xObstacle = 1280 / 40;
var yObstacle = 480 / 40;
var countWaste = 0;
var pressed = [];

// document.getElementById("play").addEventListener("click", function() {                                                                 pourquoi le clic ne marche pas
  oxo.screens.loadScreen("game", game);
// });

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

  // submarine moves
  oxo.animation.moveElementWithArrowKeys(submarine, 100);

  //bubbles moves
  // var bubbles = document.getElementById('bubbles');
  // oxo.animation.moveElementWithArrowKeys(bubbles, 100);

  // submarine death
  oxo.elements.onLeaveScreenOnce(submarine, function() {
    console.log("end");
  });

  // plane moves
  planeInterval = setInterval(function planeMove() {
    if (pressed.length !== 0) {
      for (let i = 0; i < pressed.length; i++) {
        if (pressed[i] === "q") {
          oxo.animation.move(plane, "left", 10);
        }
        if (pressed[i] === "d") {
          var position = oxo.animation.getPosition(plane);
          if (position.x < 320) {
            oxo.animation.move(plane, "right", 10);
          }
        }
      }
    }
  }, 50);

  // plane drop
  oxo.inputs.listenKeys(["a", "z", "e"], function(key) {
    var position = oxo.animation.getPosition(plane);
    if (key === "a") {
      var drop = oxo.elements.createElement({
        type: "div",
        class: "obstacle--death drop drop--little move move--down",
        styles: {
          transform: "translate(" + position.x + "px, 0px)"
        }
        // appendTo: "#water"
      });
    }
    if (key === "z") {
      var drop = oxo.elements.createElement({
        type: "div",
        class: "obstacle--death drop drop--medium move move--down",
        styles: {
          transform: "translate(" + position.x + "px, 0px)"
        }
        // appendTo: "#water"
      });
    }
    if (key === "e") {
      var drop = oxo.elements.createElement({
        type: "div",
        class: "obstacle--death drop drop--large move move--down",
        styles: {
          transform: "translate(" + position.x + "px, 0px)"
        }
        // appendTo: "#water"
      });
    }
  });

  // Score
  setInterval(addScore, speed * 100);

  //Obstacles
  obstacleInterval = setInterval(addObstacle, 1500);

  //Add Boat
  boatInterval = setInterval(addBoat, 10000);

  //Add Shark
  sharkInterval = setInterval(addShark, 7000);

  //Move
  moveInterval = setInterval(move, speed);

  //Move Down
  moveDownInterval = setInterval(moveDown, speed);

  //collisions
  collisionInterval = setInterval(listenCollision, 1000);

  //Remove
  removeInterval = setInterval(remove, 5000);

  //Acceleration
  // accelerationInterval = setInterval(acceleration, 100);

  //Array key pressed
  document.addEventListener("keydown", function(event) {
    if (pressed.indexOf(event.key) == -1) {
      pressed.push(event.key);
    }
  });

  document.addEventListener("keyup", function(event) {
    if (pressed.indexOf(event.key) > -1) {
      pressed = pressed.filter(key => key !== event.key);
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
        "px)"
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
        "px)"
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
        transform: "translate(" + (3 * size + 1280) + "px, " + -4 * size + "px)"
      },
      appendTo: "#water"
    });

    // add sprite boat on the water, on the same position than the other boat
    obstacle = oxo.elements.createElement({
      class: "obstacle obstacle--death obstacle--boat move",
      styles: {
        transform: "translate(" + (3 * size + 1280) + "px, " + 6 * size + "px)"
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
    if (death !== []) {
      oxo.elements.onCollisionWithElement(submarineLoop, death[i], function() {
        console.log("dead");
        // ecran de fin
      });
    }

    if (collectable !== []) {
      oxo.elements.onCollisionWithElement(
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
    }
  }
}

function move() {
  var allMovableElements = document.querySelectorAll(".move");
  for (let i = 0; i < allMovableElements.length; i++) {
    oxo.animation.move(allMovableElements[i], "left", 10, true); // move all elements with class .move to the left by 10px
  }
}

function moveDown() {
  var allMovableElements = document.querySelectorAll(".move--down");
  for (let i = 0; i < allMovableElements.length; i++) {
    var position = oxo.animation.getPosition(allMovableElements[i]);
    if (position.y < oxo.utils.getRandomNumber(100, 1800)) {
      oxo.animation.move(allMovableElements[i], "down", 10, true);
    } else {
      allMovableElements[i].classList.remove("move--down");
    }
  }
}

function remove() {
  var allMovableElements = document.querySelectorAll(".move");
  for (let i = 0; i < allMovableElements.length; i++) {
    //get position.x to  if it is out of the screen (on the left)
    var position = oxo.animation.getPosition(allMovableElements[i]);
    if (position.x < -800) {
      allMovableElements[i].remove();
    }
  }
}

// function acceleration() {
//   speed = speed - 1; // MARCHE PAS
// }

function addScore() {
  oxo.player.addToScore(10);
}
