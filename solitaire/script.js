// create a checkerboard
let checkerboard = document.getElementById("checkerboard");
const movesDiv = document.getElementById("moves");
const exemptIndices = [0, 1, 5, 6];
const undoStack = [];
const undoButton = document.getElementById("undo");

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

undoButton.addEventListener("click", () => {
  const cb = undoStack.pop();
});

const moves = watch(0);

function getRowCol(index) {
  const r = Math.floor(index / size);
  //Col is found by the modulus of the ith index over size.
  const c = index % size;
  return { irow: r, icol: c };
}

//add row container for dent on same row
let rowDiv = document.createElement("div");
rowDiv.classList.add("row");
checkerboard.appendChild(rowDiv);
for (let i = 0; i < Math.pow(size, 2); i++) {
  //create a dent div
  const div = document.createElement("div");
  div.classList.add("dent");
  div.addEventListener("dragover", dragOver);
  div.addEventListener("dragenter", dragEnter);
  div.addEventListener("dragleave", dragLeave);

  //add an id for each dent div
  div.id = i;
  //create a marble div
  const marblediv = document.createElement("div");
  marblediv.id = i + "c";
  marblediv.draggable = true;
  marblediv.classList.add("marble");
  marblediv.addEventListener("dragstart", function (e) {
    // set the draggable element
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ dragId: e.target.id, srcId: e.target.parentNode.id })
    );
    this.className += " hold";
  });
  marblediv.addEventListener("dragend", dragEnd);

  div.addEventListener("drop", function (e) {
    //https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/
    // get the draggable element
    const { dragId, srcId } = JSON.parse(e.dataTransfer.getData("text/plain"));

    //get row/col details of the source
    const src = getRowCol(srcId);
    const srcRow = src.irow;
    const srcCol = src.icol;

    //get row/col details of the dest
    const destId = parseInt(e.target.id);
    const dest = getRowCol(destId);
    const destRow = dest.irow;
    const destCol = dest.icol;

    //ensure the destination is either on same row or same col. No diagonal move is allowed
    if (srcRow === destRow || srcCol === destCol) {
      const immediateRow =
        srcRow < destRow ? srcRow + 1 : srcRow > destRow ? srcRow - 1 : srcRow;
      const immediateCol =
        srcCol < destCol ? srcCol + 1 : srcCol > destCol ? srcCol - 1 : srcCol;

      //use the row and col to get the dent
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
          undoStack.push({ srcId, destId });
        }
      }
    }
  });
  //since we are using a one dimensional array for a two dimensional board, we calculate the row and the column to assign the appropriate color
  //Row is found by dividing the ith index by size and taking the lower bound.
  // const irow = Math.floor(i / size);
  //Col is found by the modulus of the ith index over size.
  // const icol = i % size;
  //when irow is != row, then the row has changed. So we make irow the current row.
  const { irow, icol } = getRowCol(i);

  if (currentRow !== irow) {
    rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    checkerboard.appendChild(rowDiv);
    currentRow = irow;
  }
  div.classList.add("dent");

  //exclude putting marble in center dent
  /**
   * Here,
   */
  if (i !== centerIndex * size + centerIndex) {
    if (exemptIndices.includes(irow) && exemptIndices.includes(icol)) {
      div.classList.add("invisible");
    } else {
      div.appendChild(marblediv);
    }
  }

  rowDiv.appendChild(div);
}

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
  // this.className = "empty";
}
