const progress = document.getElementById("progress");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const circles = document.querySelectorAll(".circle");

//currently active circle.
let currentActive = 1;

next.addEventListener("click", () => {
  currentActive++;
  //current active must always be <= circles.length
  if (currentActive > circles.length) {
    currentActive = circles.length;
  }
  update();
});

prev.addEventListener("click", () => {
  currentActive--;
  //current active must always be >= 1
  if (currentActive < 1) {
    currentActive = 1;
  }
  update();
});

//updates the active circles and the width of the progress bar
function update() {
  //loop through the circles array and check if the index is equal to currentActive and then make it active or otherwise.
  circles.forEach((circle, idx) => {
    //make circles with index below currentActive active
    if (idx < currentActive) {
      circle.classList.add("active");
    } else {
      //remove the active class
      circle.classList.remove("active");
    }
  });

  //change the progress bar by changing the width property based on the number of active circles
  progress.style.width =
    ((currentActive - 1) / (circles.length - 1)) * 100 + "%";
  //if currentActive is more than 1, enable prev button and if it's equal to circle.length, disable next button. Else enable all
  if (currentActive === 1) {
    prev.disabled = true;
  } else if (currentActive === circles.length) {
    next.disabled = true;
  } else {
    prev.disabled = false;
    next.disabled = false;
  }
}
