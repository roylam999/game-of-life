const unitLength = 20;
const boxColor = 150;
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;

function setup() {
    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(windowWidth, windowHeight - 100);
    canvas.parent(document.querySelector("#canvas"));
  
    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);
  
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


function draw() {
    background(255);
    generate();
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        if (currentBoard[x][y] == 1) {
          fill(boxColor);
        } else {
        let bgColor = calcBgColor(x, y);
          fill(bgColor);
        }
        stroke(strokeColor);
        rect(x * unitLength, y * unitLength, unitLength, unitLength);
      }
    }
  }

  function calcBgColor(x,y){
    // return floor(random()*256)
    let t = Date.now() /1000;
    
    let r = floor((x/columns) *256);
    let g = round((cos(t) / 2 +0.5) * 256)
    let b = floor((y/rows) *256);

    // b = (round((sin(t) / 2 +0.5) * 256))%100
    return color(r,g,b)
  }

function generate() {
    //Loop over every single box on the board
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
            neighbors += currentBoard[peerX][peerY]
            //   currentBoard[(x + dx + columns) % columns][(y + dy + rows) % rows];
          }
        }
  
        // Rules of Life
        if (currentBoard[x][y] == 1 && neighbors < 2) {
          // Die of Loneliness
          nextBoard[x][y] = 0;
        } else if (currentBoard[x][y] == 1 && neighbors > 3) {
          // Die of Overpopulation
          nextBoard[x][y] = 0;
        } else if (currentBoard[x][y] == 0 && neighbors == 3) {
          // New life due to Reproduction
          nextBoard[x][y] = 1;
        } else {
          // Stasis
          nextBoard[x][y] = currentBoard[x][y];
        }
      }
    }
  
    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
  }
  let speedSlider; // Declare the speed slider variable


  
function updateFramerate() {
    const newFramerate = parseInt(speedSlider.value); // Get the value from the speed slider
    frameRate(newFramerate); // Set the new framerate
  }
  
  /**
 * When mouse is dragged
 */
function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
      return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    fill(boxColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
  }
  
  /**
   * When mouse is pressed
   */
function mousePressed() {
    noLoop();
    mouseDragged();
  }
  
  /**
   * When mouse is released
   */
function mouseReleased() {
    loop();
  }

document.querySelector("#reset-game").addEventListener("click", function () {
    init();
  });

//   document.querySelector("#pause-game").addEventListener("click", function () {
//     init();
//   });