const boxes = document.querySelectorAll(".box");

//fire of an event when we scroll;
window.addEventListener("scroll", checkBoxes);

checkBoxes();

//this checks the positioning of each box.
function checkBoxes() {
  // determine where we want the invisible boxes to start showing as we scroll.
  console.log(window.innerHeight);
  const triggerBottom = (window.innerHeight / 5) * 3;
  boxes.forEach((box) => {
    const boxTop = box.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      box.classList.add("show");
    } else {
      box.classList.remove("show");
    }
  });
}
