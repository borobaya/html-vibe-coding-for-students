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

// ---- Staggered entrance animations ----
function animateSlide(slide) {
  const items = slide.querySelectorAll(".animate-in");
  items.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });
}

// Reset delays when leaving a slide so re-entry re-staggers
function resetSlide(slide) {
  const items = slide.querySelectorAll(".animate-in");
  items.forEach((el) => {
    el.style.transitionDelay = "0s";
  });
}

// Animate the first slide on load
animateSlide(slides[0]);

// Restart SVG animations by re-setting the src
function restartSVGs(slide) {
  const imgs = slide.querySelectorAll('img[src$=".svg"]');
  imgs.forEach((img) => {
    const src = img.getAttribute("src");
    img.removeAttribute("src");
    requestAnimationFrame(() => {
      img.setAttribute("src", src);
    });
  });
}

function goToSlide(index) {
  if (index < 0 || index >= total) return;

  resetSlide(slides[current]);
  slides[current].classList.add("exiting");
  slides[current].classList.remove("active");

  const prevSlide = slides[current];
  setTimeout(() => prevSlide.classList.remove("exiting"), 500);

  current = index;

  animateSlide(slides[current]);
  restartSVGs(slides[current]);
  slides[current].classList.add("active");
  currentSlideEl.textContent = current + 1;
  progressFill.style.width = ((current + 1) / total) * 100 + "%";

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === total - 1;

  keyboardHint.classList.add("hidden");
}

// ---- Floating particles background ----
function createParticles() {
  const container = document.getElementById("particles");
  const count = 25;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = Math.random() * 100 + "%";
    particle.style.bottom = -(Math.random() * 20) + "%";
    particle.style.width = (2 + Math.random() * 3) + "px";
    particle.style.height = particle.style.width;
    particle.style.animationDuration = (8 + Math.random() * 12) + "s";
    particle.style.animationDelay = (Math.random() * 10) + "s";
    particle.style.opacity = 0;
    container.appendChild(particle);
  }
}

createParticles();

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
