// ======================
// VIEW OBJECT - what the player sees
// ======================
var view = {

  // Display a message to the player
  displayMessage: function (msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },

  // Show a HIT on the board
  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },

  // Show a MISS on the board
  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};


// ======================
// MODEL OBJECT (Game logic)- brain of the game
// ======================
var model = {
  boardSize: 7, //The board is 7×7
  numShips: 3, //There are 3 ships
  shipLength: 3, //Each ship is 3 long
  shipsSunk: 0, //shipsSunk starts at 0 because you haven’t won yet

  // Each ship has placeholders for locations and hits
  ships: [//We have 3 ships.
    { locations: ["0", "0", "0"], hits: ["", "", ""] }, //locations: where it is hiding
    { locations: ["0", "0", "0"], hits: ["", "", ""] }, //hits: empty strings now, but later will say "Hit"
    { locations: ["0", "0", "0"], hits: ["", "", ""] }
  ],

  // Create all ships with non-overlapping random positions
  generateShipLocations: function () {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip(); // Generate possible ship
      } while (this.collisions(locations)); // Keep retrying if it overlaps
      this.ships[i].locations = locations;
    }
  },

  // Generate a single ship (horizontal or vertical)
  generateShip: function () {
    var direction = Math.floor(Math.random() * 2); // 0=vertical, 1=horizontal
    var row, col;

    if (direction === 1) { 
      // Horizontal ship
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else { 
      // Vertical ship
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i)); // Horizontal movement
      } else {
        newShipLocations.push((row + i) + "" + col); // Vertical movement
      }
    }
    return newShipLocations;
  },

  // Check for overlapping ships
  collisions: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true; // Overlap found
        }
      }
    }
    return false;
  },

  // Fire at a location and check if it's a hit or miss
fire: function (guess) {

    for (var i = 0; i < this.numShips; i++) {
        var ship = this.ships[i];
        var index = ship.locations.indexOf(guess);

        if (index >= 0) {

            // Already hit this part before?
            if (ship.hits[index] === "Hit") {
                view.displayMessage("You already hit that!");
                return true;
            }

            ship.hits[index] = "Hit";
            view.displayHit(guess);
            view.displayMessage("HIT!");

            if (this.isSunk(ship)) {
                view.displayMessage("You sank my battleship!");
                this.shipsSunk++;
            }

            return true;
        }
    }

    // MISS but check if already marked as miss
    if (document.getElementById(guess).classList.contains("miss")) {
        view.displayMessage("You already shot there!");
        return false;
    }

    view.displayMiss(guess);
    view.displayMessage("MISS!");
    return false;
},


  // Check if all parts of a ship are hit
  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "Hit") {
        return false;
      }
    }
    return true;
  }
};

// ======================
// CONTROLLER OBJECT - the person who connects guesses to the brain of the game
// ======================
var controller = {
//Receives your guess
  guesses: 0,
//Converts it to a number like "23"
  processGuess: function (guess) {
    var location = parseGuess(guess);

    if (location) {
      this.guesses++;
      var hit = model.fire(location);

      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all ships in " + this.guesses + " guesses!");
      }
    }
  }
};

// ======================
// GAME INITIALIZATION with click handler
// ======================
function init() {
  //When the page loads: It creates all the ships, Hides them, Game ready!
  model.generateShipLocations();
  //console.log("Ships:", model.ships); // optional debug
}
window.onload = init;

/*
// ======================
// INPUT PARSING
// ======================
function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Please enter a letter + number like A3");
    return null;
  }

  var firstChar = guess.charAt(0).toUpperCase();
  var row = alphabet.indexOf(firstChar);
  var column = parseInt(guess.charAt(1), 10);

  if (row < 0 || row >= model.boardSize || isNaN(column) || column < 0 || column >= model.boardSize) {
    alert("That’s off the board!");
    return null;
  }

  return row + "" + column;
};
// ======================
// EVENT HANDLERS for form
// ======================
function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;

  controller.processGuess(guess);
  guessInput.value = "";
}

function handleKeyPress(e) {
  if (e.keyCode === 13) {
    document.getElementById("fireButton").click();
    return false;
  }
} 
// ======================
// GAME INITIALIZATION with form
// ======================
function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;

  var guessInput = document.getElementById("guessInput");
  guessInput.onkeydown = handleKeyPress;

  model.generateShipLocations();
  //console.log("Ships placed:", model.ships);
}window.onload = init;*/




