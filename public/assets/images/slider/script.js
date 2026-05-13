
document.addEventListener("DOMContentLoaded", () => {
  const right = document.querySelector(".arrow.right");
  const left = document.querySelector(".arrow.left");

  let slideNumber = 0;
  const images = document.querySelectorAll(".image");
  const length = images.length;

  function nextSlide() {
    if (slideNumber < length - 1) {
      slideNumber++;
    } else {
      slideNumber = 0;
    }
    updateSlide();
  }

  function getFirstSlide() {
    slideNumber = 0;
    updateSlide();
  }

  function prevSlide() {
    if (slideNumber > 0) {
      slideNumber--;
    } else {
      slideNumber = length - 1;
    }
    updateSlide();
  }

  function updateSlide() {
    const slider = document.querySelector(".slider");
    slider.style.transform = `translateX(-${slideNumber * 100}%)`;
  }

  if (right) {
    right.addEventListener("click", () => {
      slideNumber < length - 1 ? nextSlide() : getFirstSlide();
    });
  } else {
    console.log("Right arrow not found");
  }

  if (left) {
    left.addEventListener("click", () => {
      prevSlide();
    });
  } else {
    console.log("Left arrow not found");
  }
});
