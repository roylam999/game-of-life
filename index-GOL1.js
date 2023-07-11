const unitLength = 20;
const boxColor = 150;
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let isPaused = false;
let speedSlider;
let currentWidth, currentHeight;
let song;
let isMousePressed = false;
let changedCells = [];


function preload() {
  song = loadSound("loverse.mp3");
}

function setup() {
  /* Set the canvas to be under the element #canvas*/
  const canvas = createCanvas(windowWidth, windowHeight - 100, P2D);
  canvas.parent(document.querySelector("#canvas"));

  /*Calculate the number of columns and rows */
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  resizeCanvas(width, height - 100);
  resizeGrid();

  currentWidth = windowWidth;
  currentHeight = windowHeight - 100;

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }

  speedSlider = document.querySelector("#speed-slider");
  speedSlider.addEventListener("input", updateFramerate);
  updateFramerate();

  init(); // Set the initial values of the currentBoard and nextBoard
}

function init() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      currentBoard[i][j] = 0;
      nextBoard[i][j] = 0;
    }
  }
}

function randomizeBoard() {
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      currentBoard[x][y] = Math.random() > 0.5 ? 1 : 0; // Randomly set cell state
    }
  }
}

function windowResized() {
  // Check if the new dimensions are different from the current dimensions
  if (windowWidth !== currentWidth || (windowHeight - 100) !== currentHeight) {
    // Update the current dimensions
    currentWidth = windowWidth;
    currentHeight = windowHeight - 100;

    // Adjust the canvas size and resize the grid
    resizeCanvas(currentWidth, currentHeight);
    resizeGrid();
  }
}

function resizeGrid() {
  // Adjust the number of columns and rows based on the screen size
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  // Reinitialize the currentBoard and nextBoard arrays
  currentBoard = [];
  nextBoard = [];
  for (let i = 0; i < columns; i++) {
    currentBoard[i] = [];
    nextBoard[i] = [];
  }

  // Reset the game and redraw the grid
  init();
}

function draw() {
    // background(red(boxColor), green(boxColor), blue(boxColor));
    // clear()
  generate();
    // Draw the grid and cells
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        if (currentBoard[x][y] == 1) {
          fill('#ff000055');
        } else {
          fill('#00000005');
        }
        stroke(getStrokeColor(x, y));
        rect(x * unitLength, y * unitLength, unitLength, unitLength);
      }
    }
  
    if (isMousePressed) {
      mouseDragged();
    }
  
    for (let i = 0; i < 1; i++) {
      fill('white');
      stroke('white');
      ellipseMode(CENTER);
      strokeWeight(0.3);
      let x = Math.random() * columns * unitLength;
      let y = Math.random() * rows * unitLength;
      ellipse(x, y, 2, 2);
      ellipse(x, y, 2, 2);
    }
  }
  

function getStrokeColor(x, y) {
  let t = Date.now() / 1000;

  let r = floor((x / columns) * 256);
  let g = round((cos(t) / 2 + 0.5) * 256);
  let b = floor((y / rows) * 256);

  return color(r, g, b);
}

function generate() {
  // Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      for (let dx of [-1, 0, 1]) {
        for (let dy of [-1, 0, 1]) {
          if (dx == 0 && dy == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge
          let peerX = (x + dx + columns) % columns;
          let peerY = (y + dy + rows) % rows;
          neighbors += currentBoard[peerX][peerY];
          //   currentBoard[(x + dx + columns) % columns][(y + dy + rows) % rows];
        }
      }

      // Rules of Life
      if (currentBoard[x][y] == 1 && neighbors < 2) {
        // Die of Loneliness
        nextBoard[x][y] = 0;
        changedCells.push({ x, y }); // Add the changed cell to the list
      } else if (currentBoard[x][y] == 1 && neighbors > 3) {
        // Die of Overpopulation
        nextBoard[x][y] = 0;
        changedCells.push({ x, y }); // Add the changed cell to the list
      } else if (currentBoard[x][y] == 0 && neighbors == 3) {
        // New life due to Reproduction
        nextBoard[x][y] = 1;
        changedCells.push({ x, y }); // Add the changed cell to the list
      } else {
        // Stasis
        nextBoard[x][y] = currentBoard[x][y];
      }
    }
  }

  // Swap the nextBoard to be the current Board
  [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function updateFramerate() {
  const newFramerate = parseInt(speedSlider.value);
  frameRate(newFramerate);
}

/**
 * When mouse is dragged
 */
function mouseDragged() {
    if (!isPaused) {
      const x = Math.floor(mouseX / unitLength);
      const y = Math.floor(mouseY / unitLength);
  
      // Check if the mouse is within the grid boundaries
      if (x >= 0 && x < columns && y >= 0 && y < rows) {
        // Calculate the distance from the mouse position to the cell center
        const distance = dist(mouseX, mouseY, (x + 0.5) * unitLength, (y + 0.5) * unitLength);
  
        // Calculate the fill color alpha based on the distance
        const alpha = map(distance, 0, unitLength / 2, 255, 0, true);
  
        // Update the cell state and fill color
        currentBoard[x][y] = 1;
        fill(`rgba(255, 0, 0, ${alpha})`);
        stroke(strokeColor);
        rect(x * unitLength, y * unitLength, unitLength, unitLength);
  
        if (!song.isPlaying()) {
          song.play();
        }
      }
    }
  }
  
function mousePressed() {
  if (!isPaused) {
  isMousePressed = true;
  }
}

function mouseReleased() {
  if (!isPaused && isMousePressed) {
    isMousePressed = false;
    loop();
  }
}

/**
 * Event listeners
 */

document.querySelector("#reset-game").addEventListener("click", function () {
  init();
  song.stop(); // Stop the song
//   song.play();
  loop(); // Resume the game
  isPaused = false;
  document.querySelector("#pause-game").textContent = "Pause Game";
});

document.querySelector("#pause-game").addEventListener("click", togglePause);

function togglePause() {
  if (isPaused) {
    song.play();
    loop(); // Resume the game
    isPaused = false;
    document.querySelector("#pause-game").textContent = "Pause Game";
  } else {
    song.pause();
    noLoop(); // Pause the game
    isPaused = true;
    document.querySelector("#pause-game").textContent = "Resume Game";
  }
}

document.querySelector("#randomize-button").addEventListener("click", function () {
  randomizeBoard();
  if (!song.isPlaying()) {
    song.play();
  }
  isPaused = false;
  document.querySelector("#pause-game").textContent = "Pause Game";
});
