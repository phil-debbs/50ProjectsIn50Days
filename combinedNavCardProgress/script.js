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

var ball = document.getElementById("ball");
document.addEventListener(
  "click",
  function (ev) {
    const ballcenter = ball.offsetWidth / 2;
    ball.style.transform = "translateY(" + (ev.clientY - ballcenter) + "px)";
    ball.style.transform += "translateX(" + (ev.clientX - ballcenter) + "px)";
  },
  false
);

// // expanding cards
// panels.forEach((panel, idx) => {
//   panel.addEventListener("click", () => {
//     if (panel.classList.contains("active")) {
//       panel.classList.remove("active");
//       return;
//     }
//     removeActiveClasses();
//     panel.classList.add("active");
//   });
// });

function removeActiveClasses() {
  panels.forEach((panel) => {
    panel.classList.remove("active");
  });
}
