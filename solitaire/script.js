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

function watch(val) {
  return new Proxy(JSON.parse('{"watch":' + val + "}"), {
    set: function (target, property, value) {
      movesDiv.innerText = `Moves: ${value}`;
      target[property] = value;
    },
  });
}
const moves = watch(0);

undoButton.addEventListener("click", () => {
  if (!undoStack || undoStack.length === 0) {
    return false;
  }
  const { srcId, destId } = undoStack.pop();
  //at this point the destination Id becomes the source since we are undoing. so swap
  const dest = parseInt(srcId);
  const src = destId;

  const { isValid, immediateId } = checkMoveValidity(src, dest);
  if (isValid) {
    //count moves
    moves.watch--;
    const immediateBoard = document.getElementById(`${immediateId}`);

    const destBoard = document.getElementById(`${dest}`);
    const srcBoard = document.getElementById(`${src}`);
    const immediateMarble = createMarble(immediateId);
    immediateBoard.appendChild(immediateMarble);
    // const draggable = document.getElementById(dragId);
    // if (!e.target.draggable) {
    // add it to the drop target
    const destMarble = createMarble(dest);
    destBoard.appendChild(destMarble);
    srcBoard.removeChild(srcBoard.firstChild);
    // undoStack.push({ dest, src });
    // }
  }
});

function getRowCol(index) {
  const r = Math.floor(index / size);
  //Col is found by the modulus of the ith index over size.
  const c = index % size;
  return { irow: r, icol: c };
}

//create a marble div
function createMarble(id) {
  const marblediv = document.createElement("div");
  marblediv.id = id + "c";
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
  return marblediv;
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
  const marblediv = createMarble(i);
  // marblediv.id = i + "c";
  // marblediv.draggable = true;
  // marblediv.classList.add("marble");
  // marblediv.addEventListener("dragstart", function (e) {
  //   // set the draggable element
  //   e.dataTransfer.setData(
  //     "text/plain",
  //     JSON.stringify({ dragId: e.target.id, srcId: e.target.parentNode.id })
  //   );
  //   this.className += " hold";
  // });
  // marblediv.addEventListener("dragend", dragEnd);

  div.addEventListener("drop", function (e) {
    //https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/
    // get the draggable element
    const { dragId, srcId } = JSON.parse(e.dataTransfer.getData("text/plain"));
    const destId = parseInt(e.target.id);
    const { isValid, immediateId } = checkMoveValidity(srcId, destId);
    if (isValid) {
      //count moves
      moves.watch++;
      const immediateBoard = document.getElementById(`${immediateId}`);
      immediateBoard.removeChild(immediateBoard.firstChild);
      const draggable = document.getElementById(dragId);
      if (!e.target.draggable) {
        // add it to the drop target
        e.target.appendChild(draggable);
        undoStack.push({ srcId, destId });
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

function checkMoveValidity(srcId, destId) {
  //get row/col details of the source
  const src = getRowCol(srcId);
  const srcRow = src.irow;
  const srcCol = src.icol;

  //get row/col details of the dest
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

    const isValid = validNeighbour; //&& immediateBoard.firstChild;

    // if (isValid) {
    return { isValid, immediateId };
    // }

    // return false;
    // if () {
    //   //valid destination so move.
    //   //count moves
    //   moves.watch++;

    //   const draggable = document.getElementById(dragId);
    //   if (!e.target.draggable) {
    //     // add it to the drop target
    //     e.target.appendChild(draggable);
    //     undoStack.push({ srcId, destId });
    //   }
    // }
  }
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
