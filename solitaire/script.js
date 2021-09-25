// create a checkerboard
const checkerboard = document.getElementById("checkerboard");
const movesDiv = document.getElementById("moves");
const checkerboardObj = {};

const size = 7;
let currentRow = 0;
let currentCol = 0;
const centerIndex = Math.floor(size / 2);

function watch(j) {
  return new Proxy(JSON.parse('{"watch":' + j + "}"), {
    set: function (target, property, value) {
      movesDiv.innerText = `Moves: ${value}`;
      // // do something
      // console.log(
      //   "check4 value changed from " + target[property] + " to " + value
      // );
      target[property] = value;
    },
  });
}

const moves = watch(0);

//add row container for board on same row
let rowDiv = document.createElement("div");
rowDiv.classList.add("row");
checkerboard.appendChild(rowDiv);
for (let i = 0; i < Math.pow(size, 2); i++) {
  //create a board div
  const div = document.createElement("div");
  div.classList.add("board");
  div.classList.add("empty");
  div.addEventListener("dragover", dragOver);
  div.addEventListener("dragenter", dragEnter);
  div.addEventListener("dragleave", dragLeave);

  //add an id for each board div
  div.id = i;
  //create a pebble div
  const pebblediv = document.createElement("div");
  pebblediv.id = i + "c";
  pebblediv.draggable = true;
  pebblediv.classList.add("pebble");
  pebblediv.addEventListener("dragstart", function (e) {
    // set the draggable element
    e.dataTransfer.setData(
      "text/json",
      JSON.stringify({ dragId: e.target.id, srcId: i })
    );
    this.className += " hold";
  });
  pebblediv.addEventListener("dragend", dragEnd);

  div.addEventListener("drop", function (e) {
    //https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/
    // get the draggable element
    const { dragId, srcId } = JSON.parse(e.dataTransfer.getData("text/json"));

    //get row/col details of the source
    const srcRow = Math.floor(srcId / size);
    const srcCol = srcId % size;

    //get row/col details of the dest
    const destId = parseInt(e.target.id);
    const destRow = Math.floor(destId / size);
    const destCol = destId % size;

    const immediateRow =
      srcRow < destRow ? srcRow + 1 : srcRow > destRow ? srcRow - 1 : srcRow;
    const immediateCol =
      srcCol < destCol ? srcCol + 1 : srcCol > destCol ? srcCol - 1 : srcCol;

    //use the row and col to get the board
    const immediateId = immediateRow * size + immediateCol;
    const immediateBoard = document.getElementById(`${immediateId}`);

    const validNeighbour =
      Math.abs(srcRow - destRow) === 2 || Math.abs(srcCol - destCol) === 2;
    if (validNeighbour && immediateBoard.firstChild) {
      //valid destination so move.
      //count moves
      moves.watch++;

      immediateBoard.removeChild(immediateBoard.firstChild);
      const draggable = document.getElementById(dragId);
      if (!e.target.draggable) {
        // add it to the drop target
        e.target.appendChild(draggable);
      }
    }
  });
  //since we are using a one dimensional array for a two dimensional board, we calculate the row and the column to assign the appropriate color
  //Row is found by dividing the ith index by size and taking the lower bound.
  const irow = Math.floor(i / size);
  //Col is found by the modulus of the ith index over size.
  const icol = i % size;
  //when irow is != row, then the row has changed. So we make irow the current row.
  if (currentRow !== irow) {
    rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    checkerboard.appendChild(rowDiv);
    currentRow = irow;
  }
  div.classList.add("board");

  //exclude putting pebble in center board
  /**
   * Here,
   */
  if (i !== centerIndex * size + centerIndex) {
    div.appendChild(pebblediv);
  }

  rowDiv.appendChild(div);
  checkerboardObj[i] = { div: div };
}

const empties = document.querySelectorAll(".empty");

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  this.className += " hold";
}

function dragEnd(e) {
  e.preventDefault();
}

function dragOver(e) {
  //check if element is valid drop target
  //Call the event.preventDefault() on the dragenter and dragover event handlers to make an element a valid drop target.
  if (!e.target.draggable) e.preventDefault();
}

function dragEnter(e) {
  //check if element is valid drop target
  //Call the event.preventDefault() on the dragenter and dragover event handlers to make an element a valid drop target.
  if (!e.target.draggable) e.preventDefault();
  // e.preventDefault();
  // this.className += " hovered";
}

function dragLeave(e) {
  this.className = "empty";
}
