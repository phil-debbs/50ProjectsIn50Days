const progress = document.getElementById("progress");
const circles = document.querySelectorAll(".circle");
const panels = document.querySelectorAll(".panel");

//currently active circle.
circles.forEach((circle, idx) => {
  circle.addEventListener("click", () => {
    update(idx);
  });
});

//updates the active circles and the width of the progress bar
function update(clickedIndex) {
  //loop through the circles array and check if the index is equal to clickedIndex and then make it active or otherwise.
  circles.forEach((circle, idx) => {
    //make circles with index below clickedIndex active
    if (idx <= clickedIndex) {
      circle.classList.add("active");
    } else {
      //remove the active class
      circle.classList.remove("active");
    }
  });
  removeActiveClasses();
  panels[clickedIndex].classList.add("active");
  // panels[clickedIndex].addEventListener("click", () => {
  //   if (panel.classList.contains("active")) {
  //     panel.classList.remove("active");
  //     return;
  //   }
  //   removeActiveClasses();
  //   panel.classList.add("active");
  // });
  //change the progress bar by changing the width property based on the number of active circles
  progress.style.width = (clickedIndex / (circles.length - 1)) * 100 + "%";
}

function removeActiveClasses() {
  panels.forEach((panel) => {
    panel.classList.remove("active");
  });
}

var ball = document.getElementById("ball");

// add a checkerboard
const checkerboard = document.getElementById("checkerboard");
const checkerboardObj = {};

const size = 7;
const boardColors = ["checkcolor1", "checkcolor2"];
let currentRow = 0;
let currentCol = 0;
const centerIndex = Math.floor(size / 2);

for (let i = 0; i < Math.pow(size, 2); i++) {
  //create a board div
  const div = document.createElement("div");
  //add an id for each board div
  div.id = i;
  //create a pebble div
  const pebblediv = document.createElement("div");
  //since we are using a one dimensional array for a two dimensional board, we calculate the row and the column to assign the appropriate color
  //Row is found by dividing the ith index by size and taking the lower bound.
  const irow = Math.floor(i / size);
  //Col is found by the modulus of the ith index over size.
  const icol = i % size;
  //when irow is != row, then the row has changed. So we make irow the current row.
  if (currentRow !== irow) {
    const br = document.createElement("br");
    checkerboard.appendChild(br);
    currentRow = irow;
  }
  div.classList.add("board");

  //exclude putting pebble in center board
  /**
   * Here,
   */
  if (i !== centerIndex * size + centerIndex) {
    div.classList.add("checkcolor1");
    pebblediv.classList.add("pebble");
    pebblediv.addEventListener("click", function (e) {
      if (pebblediv.classList.contains("active")) {
        pebblediv.classList.remove("active");
      } else {
        removeAllActivePebbles();
        pebblediv.classList.add("active");
      }
    });
    div.appendChild(pebblediv);
  } else {
    div.classList.add("checkcolor1");
    // div.classList.add(boardColors[(irow + icol) % 2]);
  }

  //removeAllActivePebbles
  function removeAllActivePebbles() {
    const pebbles = document.querySelectorAll(".pebble");
    pebbles.forEach((pebble) => {
      pebble.classList.remove("active");
    });
  }

  //add click event
  div.addEventListener(
    "click",
    function (ev) {
      // console.log(ev);
      // const ballcenter = ball.offsetWidth / 2;
      // ball.style.transform = "translateY(" + (ev.clientY - ballcenter) + "px)";
      // ball.style.transform += "translateX(" + (ev.clientX - ballcenter) + "px)";
    },
    false
  );
  checkerboard.appendChild(div);
  checkerboardObj[i] = { div: div };
}

// document.addEventListener(
//   "click",
//   function (ev) {
//     const ballcenter = ball.offsetWidth / 2;
//     ball.style.transform = "translateY(" + (ev.clientY - ballcenter) + "px)";
//     ball.style.transform += "translateX(" + (ev.clientX - ballcenter) + "px)";
//   },
//   false
// );
