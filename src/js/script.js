var speed = 20;
var keyPlane = [];
var scoreInterval;
var obstacleInterval;
var wasteInterval;
var moveInterval;
var moveDownIntervalLittle;
var moveDownIntervalMedium;
var moveDownIntervalLarge;
var removeInterval;
var barrelInterval;
var sharkInterval;
var accelerationInterval;
var planeInterval;
var size = 40;
var xObstacle = 1280 / 60;
var yObstacle = 480 / 60;
var countWaste = 0;
var pressed = [];
var submarine;
var canDrop = true;
var life = 3;

oxo.screens.loadScreen("home", home);

function home() {
  document.getElementById("play").addEventListener("click", function() {
    oxo.screens.loadScreen("game", game);
  });
  document.getElementById("instructions").addEventListener("click", function() {
    oxo.screens.loadScreen("instructions", instructions);
  });
}

function game() {
  //reset scores
  oxo.player.setScore(0);
  countWaste = 0;
  life = 3;

  submarine = oxo.elements.createElement({
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

  // submarine death
  oxo.elements.onLeaveScreenOnce(
    submarine,
    function() {
      death();
    },
    true
  );

  // plane moves
  planeInterval = setInterval(function planeMove() {
    skyBar = document.getElementById("sky__bar");
    if (pressed.length !== 0) {
      for (let i = 0; i < pressed.length; i++) {
        if (pressed[i] === "q") {
          oxo.animation.move(plane, "left", 10);
          oxo.animation.move(skyBar, "left", 10);
        }
        if (pressed[i] === "d") {
          var position = oxo.animation.getPosition(plane);
          if (position.x < 320) {
            oxo.animation.move(plane, "right", 10);
            oxo.animation.move(skyBar, "right", 10);
          }
        }
      }
    }
  }, 50);

  // plane drop
  oxo.inputs.listenKeys(["a", "z", "e"], function(key) {
    var position = oxo.animation.getPosition(plane);
    skyBar.classList.add("isTriggered");
    if (!canDrop) {
      return;
    }
    canDrop = false;
    setTimeout(function() {
      skyBar.classList.remove("isTriggered");
      canDrop = true;
    }, 1500);
    if (key === "a") {
      var drop = oxo.elements.createElement({
        type: "div",
        class: "obstacle--death drop drop--little move move--down",
        styles: {
          transform: "translate(" + position.x + "px, 0px)"
        },
        appendTo: "#wrap"
      });
      oxo.elements.onCollisionWithElement(submarine, drop, function() {
        collision();
      });
    }

    if (key === "z") {
      var drop = oxo.elements.createElement({
        type: "div",
        class: "obstacle--death drop drop--medium move move--down",
        styles: {
          transform: "translate(" + position.x + "px, 0px)"
        },
        appendTo: "#wrap"
      });
      oxo.elements.onCollisionWithElement(submarine, drop, function() {
        collision();
      });
    }

    if (key === "e") {
      var drop = oxo.elements.createElement({
        type: "div",
        class: "obstacle--death drop drop--large move move--down",
        styles: {
          transform: "translate(" + position.x + "px, 0px)"
        },
        appendTo: "#wrap"
      });
      oxo.elements.onCollisionWithElement(submarine, drop, function() {
        collision();
      });
    }
  });

  // Score
  scoreInterval = setInterval(addScore, speed * 100);

  //Obstacles
  obstacleInterval = setInterval(addObstacle, 1300);

  // Add Wastes
  wasteInterval = setInterval(addWaste, 2000);

  //Add Barrel
  barrelInterval = setInterval(addBarrel, 8000);

  //Add Shark
  sharkInterval = setInterval(addShark, 12000);

  //Move
  moveInterval = setInterval(move, speed);

  //Move Down Little
  moveDownIntervalLittle = setInterval(moveDownLittle, speed);

  //Move Down Medium
  moveDownIntervalMedium = setInterval(moveDownMedium, speed);

  //Move Down Large
  moveDownIntervalLarge = setInterval(moveDownLarge, speed);

  //Remove
  removeInterval = setInterval(remove, 5000);

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
  var obstacle = oxo.elements.createElement({
    class: "obstacle obstacle--death obstacle--rock move",
    styles: {
      transform:
        "translate(" +
        (oxo.utils.getRandomNumber(0, xObstacle - 1) * size + 1280) +
        "px, " +
        oxo.utils.getRandomNumber(-2, yObstacle - 1) * size +
        "px)"
    },
    appendTo: "#water"
  });

  // Check collisions
  oxo.elements.onCollisionWithElement(submarine, obstacle, function() {
    if (!submarine.classList.contains("collision")) {
      collision();
    }
  });
}

function addWaste() {
  //Add obstacle--waste to the screen at a random position
  var obstacle = oxo.elements.createElement({
    class: "obstacle obstacle--waste obstacle--can move",
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
  var obstacle_bag = oxo.elements.createElement({
    class: "obstacle obstacle--waste obstacle--bag move",
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

  // Check collisions
  oxo.elements.onCollisionWithElement(submarine, obstacle_bag, function() {
    obstacle_bag.remove();
    // Add count waste
    countWaste++;
    console.log(countWaste);
    document.getElementById("score--waste").innerHTML = countWaste;
  });
  oxo.elements.onCollisionWithElement(submarine, obstacle, function() {
    obstacle.remove();
    // Add count waste
    countWaste++;
    console.log(countWaste);
    document.getElementById("score--waste").innerHTML = countWaste;
  });
}

function addBarrel() {
  if (oxo.player.getScore() > 200) {
    // add sprite barrel on the water
    var obstacle = oxo.elements.createElement({
      class: "obstacle obstacle--death obstacle--barrel move",
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

  // Check collisions
  oxo.elements.onCollisionWithElement(submarine, obstacle, function() {
    collision();
  });
}

function addShark() {
  //Add obstacle--shark
  if (oxo.player.getScore() > 100) {
    var obstacle = oxo.elements.createElement({
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

  // Check collisions
  oxo.elements.onCollisionWithElement(submarine, obstacle, function() {
    collision();
  });
}

function move() {
  var allMovableElements = document.querySelectorAll(".move");
  for (let i = 0; i < allMovableElements.length; i++) {
    oxo.animation.move(allMovableElements[i], "left", 10, true); // move all elements with class .move to the left by 10px
  }
}

function moveDownLittle() {
  var allMovableElements = document.querySelectorAll(
    ".move--down.drop--little"
  );
  for (let i = 0; i < allMovableElements.length; i++) {
    var position = oxo.animation.getPosition(allMovableElements[i]);
    if (position.y < 220) {
      oxo.animation.move(allMovableElements[i], "down", 10, true);
    } else {
      allMovableElements[i].classList.remove("move--down");
    }
  }
}

function moveDownMedium() {
  var allMovableElements = document.querySelectorAll(
    ".move--down.drop--medium"
  );
  for (let i = 0; i < allMovableElements.length; i++) {
    var position = oxo.animation.getPosition(allMovableElements[i]);
    if (position.y < 350) {
      oxo.animation.move(allMovableElements[i], "down", 10, true);
    } else {
      allMovableElements[i].classList.remove("move--down");
    }
  }
}

function moveDownLarge() {
  var allMovableElements = document.querySelectorAll(".move--down.drop--large");
  for (let i = 0; i < allMovableElements.length; i++) {
    var position = oxo.animation.getPosition(allMovableElements[i]);
    if (position.y < 500) {
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

function addScore() {
  oxo.player.addToScore(10);
}

function collision() {
  life--;
  submarine.classList.add("collision");
  setTimeout(() => {
    submarine.classList.remove("collision");
  }, 700);
  document.getElementById("count").innerHTML = life;
  if (life === 0) {
    // launch ending screen function
    death();
  }
}

function death() {
  console.log("death");
  clearInterval(scoreInterval);
  clearInterval(obstacleInterval);
  clearInterval(wasteInterval);
  clearInterval(moveInterval);
  clearInterval(moveDownIntervalLittle);
  clearInterval(moveDownIntervalMedium);
  clearInterval(moveDownIntervalLarge);
  clearInterval(removeInterval);
  clearInterval(barrelInterval);
  clearInterval(sharkInterval);
  clearInterval(accelerationInterval);
  clearInterval(planeInterval);
  oxo.screens.loadScreen("end", end);
}

function end() {
  document.getElementById("end__score--collected").innerHTML = countWaste;
  oxo.inputs.listenKey("enter", function() {
    oxo.screens.loadScreen("game", game);
    oxo.inputs.cancelKeyListener("enter");
  });
}

function instructions() {
  setTimeout(function() {
    document.getElementById("back").addEventListener("click", function() {
      oxo.screens.loadScreen("home", home);
    });
  });
}
