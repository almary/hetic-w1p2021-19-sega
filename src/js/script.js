var speed = 10;
var obstacleInterval;
var moveInterval;
var accelerationInterval;
var size = 40;
var xObstacle = 1280 / 40;
var yObstacle = 560 / 40;

oxo.screens.loadScreen("game", game);

// function moveElementWithKeys(element, speed) {
//   var pixels = speed > 100 ? Math.round(speed / 100) : 1;
//   var interval;
//   var pressed = [];

//     document.addEventListener('keydown', function(event) {
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
      oxo.animation.move(plane, "right", 20 );
    }
  });

  // submarine moves
  oxo.animation.moveElementWithArrowKeys(submarine, 150);
 // submarine death
  oxo.elements.onLeaveScreenOnce(submarine, function() {
    console.log("end");
  });

  // Score
  setInterval(addScore, speed * 10);

  // Obstacles
  obstacleInterval = setInterval(addObstacle, speed * 150); // Call the addObstacle function every 15 turn

  //Move
  moveInterval = setInterval(move, speed);

  //Acceleration
  accelerationInterval = setInterval(acceleration, 1)
}




function addObstacle() {
  // Add an obstacle element to the screen at a random position
  obstacle = oxo.elements.createElement({
    class: "obstacle move",
    styles: {
      transform:
        "translate(" +
        ((oxo.utils.getRandomNumber(0, xObstacle - 1) * size)+ 1280) +
        "px, " +
        oxo.utils.getRandomNumber(0, yObstacle - 1) * size +
        "px)" // PROBLEME : ne pop pas au dessus d'une certaine ligne
    },
    appendTo: "#water"
  });
}

function move() {
  var allMovableElements = document.querySelectorAll(".move");
  for (let i = 0; i < allMovableElements.length; i++) {
    oxo.animation.move(allMovableElements[i], 'left', 5, true); // move all elements with class .move to the left by 10px

    //get position.x to remove if it is out of the screen (on the left)
    var position = oxo.animation.getPosition(allMovableElements[i]);
    if (position.x < 0 - size) {
      allMovableElements[i].remove();
    }
  }
}

function acceleration() {
  speed = speed - 5;                // MARCHE PAS
}

function addScore() {
  oxo.player.addToScore(1);
}