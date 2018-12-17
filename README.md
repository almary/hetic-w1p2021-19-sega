https://submarine-survivor.netlify.com/

# `OXO` game library

This is a boilerplate repository using `OXO`, a minimalist game library to handle common actions in games. This is not optimized for production and uses purposefully simplified patterns for an educational purpose.

- [How to use](#how-to-use)
  - [Development mode](#development-mode)
  - [Production mode](#production-mode)
- [Files structure](#files-structure)
  - [html](#html)
  - [css](#css)
  - [js](#js)
- [The `OXO` library](#the--oxo--library)
  - [Functions](#functions)
    - [Screens](#screens)
      - [`loadScreen`](#-loadscreen-)
      - [`getCurrentScreen`](#-getcurrentscreen-)
    - [Elements](#elements)
      - [`createElement`](#-createelement-)
      - [`onLeaveScreen`](#-onleavescreen-)
      - [`onLeaveScreenOnce`](#-onleavescreenonce-)
      - [`onCollisionWithElement`](#-oncollisionwithelement-)
      - [`onCollisionWithElementOnce`](#-oncollisionwithelementonce-)
    - [Animation](#animation)
      - [`getPosition`](#-getposition-)
      - [`setPosition`](#-setposition-)
      - [`move`](#-move-)
      - [`moveElementWithArrowKeys`](#-moveelementwitharrowkeys-)
    - [Player](#player)
      - [`getScore`](#-getscore-)
      - [`setScore`](#-setscore-)
      - [`addToScore`](#-addtoscore-)
      - [`removeFromScore`](#-removefromscore-)
    - [Inputs](#inputs)
      - [`listenKey`](#-listenkey-)
      - [`listenKeys`](#-listenkeys-)
      - [`listenArrowKeys`](#-listenarrowkeys-)
      - [`listenKeyOnce`](#-listenkeyonce-)
      - [`cancelKeyListener`](#-cancelkeylistener-)
      - [`cancelKeysListeners`](#-cancelkeyslisteners-)
      - [`cancelArrowKeysListeners`](#-cancelarrowkeyslisteners-)
    - [Utils](#utils)
      - [`getRandomNumber`](#-getrandomnumber-)
  - [Data attributes](#data-attributes)
    - [`data-oxo-score`](#-data-oxo-score-)
    - [`data-oxo-movable`](#-data-oxo-movable-)

## How to use

Clone and cd into the repository and run `npm install`

### Development mode

`npm run dev`

Open `localhost:1234/index.html`

### Production mode

`npm run build`

Serve the `dist` folder.

## Files structure

### html

Work in the `src/screens` folder. Each screen is located here. There are two screens by default : `home` and `game`. Home is loaded when the app starts.

When a screen is loaded, it is injected into the `body` of `index.html`, which should not be modified.

### css

Work in the `src/scss` folder. For simplicity, the same stylesheet will be used for all the screens.

If you need to target a special screen, you can target the class that is added to the `body` each time a screen is loaded. For example, when the `home` screen is loaded you will have `<body class="home">`.

### js

Work in the `src/js/script.js` file. You can use the `OXO` library to help you to write your game's code.

## The `OXO` library

### Functions

This is a list of the functions provided by `oxo` that you can use inside your script. Note that each function are documented inside the code, in case you need more details.

#### Screens

These function allow to manage which screen is presented.

##### `loadScreen`

Load a new screen and execute an action. The first argument must match the name of the `html` file.

```
oxo.screens.loadScreen('game', function() {
  // game.html is loaded, do something
});
```

##### `getCurrentScreen`

Get the name of the current screen.

```
oxo.screens.getCurrentScreen(); // 'home'
```

#### Elements

These function allow to create and observe elements.

##### `createElement`

Create an element and insert it into the document. The function returns the created element.

```
var element = oxo.elements.createElement({
  type: 'div', // optional
  class: 'my-element' // optional,
  styles: { // optional
    transform: 'translate(50px, 50px)
  },
  appendTo: 'body' // optional
});

// element is appended to the document
```

##### `onLeaveScreen`

Detect the collision between an element and the border of the screen, and executes the given action.

```
var character = document.getElementById('character');
oxo.elements.onLeaveScreen(character, function() {
  // Character is leaving the screen
});
```

##### `onLeaveScreenOnce`

Same as `onLeaveScreen`, but the action will be executed only once. Better for performance.

```
var character = document.getElementById('character');
oxo.elements.onLeaveScreenOnce(character, function() {
  // Character is leaving the screen
});
```

##### `onCollisionWithElement`

Detect the collision between an element and a target, and executes the given action.

```
var character = document.getElementById('character');
var ennemy = document.getElementById('ennemy');
oxo.elements.onCollisionWithElement(character, ennemy, function() {
  // Character is touched by ennemy
});
```

##### `onCollisionWithElementOnce`

Same as `onCollisionWithElement`, but the action will be executed only once. Better for performance.

```
var character = document.getElementById('character');
var ennemy = document.getElementById('ennemy');
oxo.elements.onCollisionWithElementOnce(character, ennemy, function() {
  // Character is touched by ennemy
});
```

#### Animation

These function allow to manipulate the elements of the screen. For a better experience using `OXO`, you should use `transform: translate()` to set the position of your elements.

##### `getPosition`

Get the position of an element (the values of the transform property).

```
var character = document.getElementById('character');
var position = oxo.animation.getPosition(character);
console.log(position.x); // 10
console.log(position.y); // 0
```

##### `setPosition`

Set the position of an element by passing an x and an y value.

```
var character = document.getElementById('character');
oxo.animation.setPosition(character, {x: 10, y: 0});
```

##### `move`

Move an element in a given direction with a given distance (by modifying its transform property). The element cannot cross the screen limits, except if you set the fourth parameter to `true`.

```
var character = document.getElementById('character');
oxo.animation.move(character, 'right', 10); // Move 10px to the right
```

The direction can be `left`, `top`, `right`, `down`, or an x direction combined with an y direction (eg `left-up`).

##### `moveElementWithArrowKeys`

Move an element when the user presses the arrow keys. The second parameter is the speed of the movement, from 1 to infinite.

```
var character = document.getElementById('character');
oxo.animation.moveElementWithArrowKeys(character, 10); // Move the character slowly
```

#### Player

These functions allow to handle informations related to the player.

##### `getScore`

Get the current score of the player

```
oxo.player.getScore(); // 78
```

##### `setScore`

Set the score to a specific value

```
oxo.player.setScore(78);
```

##### `addToScore`

Add points to the score

```
oxo.player.addToScore(1); // Add 1 point
```

##### `removeFromScore`

Remove points from the score

```
oxo.player.removeFromScore(1); // Remove 1 point
```

#### Inputs

These functions allow you to react to inputs from the player.

##### `listenKey`

Execute the given action each time the given key is pressed.

```
oxo.inputs.listenKey('enter', function() {
  // do something
});
```

The keys that can be listened to are `enter`, `space`, `left`, `up`, `right`, `down` and `a` to `z`.

##### `listenKeys`

Same as `listenKey`, but with several keys that can be pressed. The key that was pressed is available in the callback function.

```
oxo.inputs.listenKeys(['up', 'down], function(key) {
  console.log(key); // 'up' or 'down';
});
```

##### `listenArrowKeys`

Same as `listenKeys`, but with each arrow key (`left`, `up`, `right`, `down`).

```
oxo.inputs.listenArrowKeys(function(key) {
  console.log(key); // `left`, `up`, `right` or `down`;
});
```

##### `listenKeyOnce`

Same as `listenKey`, but the action will only be executed once.

```
oxo.inputs.listenKeyOnce('enter', function() {
  // do something only once
});
```

##### `cancelKeyListener`

Stop listening for a key.

```
oxo.inputs.cancelKeyListener('enter');
```

##### `cancelKeysListeners`

Stop listening for several keys.

```
oxo.inputs.cancelKeysListeners(['up', 'down']);
```

##### `cancelArrowKeysListeners`

Stop listening for the arrow keys.

```
oxo.inputs.cancelArrowKeysListeners();
```

#### Utils

Some utility functions.

##### `getRandomNumber`

Get a random number between two numbers.

```
oxo.utils.getRandomNumber(1, 3); // 1, 2 or 3
```

### Data attributes

You can add data attributes to your HTML. They will be used by `oxo` for information presentation or interaction.

#### `data-oxo-score`

The element will present the current score.

```
<div data-oxo-score></div>
```

#### `data-oxo-movable`

The element will be moved when the user uses the arrow keys. Use the `data-oxo-speed` to set the speed of the movement, from 1 to infinite.

```
<div data-oxo-movable data-oxo-speed="10"></div>
```
"# test"  git init git add README.md git commit -m "first commit" git remote add origin https://github.com/almary/test.git git push -u origin master
