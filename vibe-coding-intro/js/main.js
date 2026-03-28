const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const currentSlideEl = document.getElementById("currentSlide");
const totalSlidesEl = document.getElementById("totalSlides");
const progressFill = document.getElementById("progressFill");
const keyboardHint = document.getElementById("keyboardHint");

let current = 0;
const total = slides.length;

totalSlidesEl.textContent = total;

function goToSlide(index) {
  if (index < 0 || index >= total) return;

  slides[current].classList.add("exiting");
  slides[current].classList.remove("active");

  // Clean up the exiting class after the transition
  const prevSlide = slides[current];
  setTimeout(() => prevSlide.classList.remove("exiting"), 500);

  current = index;

  slides[current].classList.add("active");
  currentSlideEl.textContent = current + 1;
  progressFill.style.width = ((current + 1) / total) * 100 + "%";

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === total - 1;

  // Hide the keyboard hint after first navigation
  keyboardHint.classList.add("hidden");
}

function next() {
  goToSlide(current + 1);
}

function prev() {
  goToSlide(current - 1);
}

// Button clicks
nextBtn.addEventListener("click", next);
prevBtn.addEventListener("click", prev);

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === " ") {
    e.preventDefault();
    next();
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    prev();
  }
});

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 60) {
    if (diff > 0) {
      next();
    } else {
      prev();
    }
  }
});

// Initial state
prevBtn.disabled = true;
